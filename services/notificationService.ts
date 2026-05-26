import { Server as SocketIOServer, Socket } from "socket.io";
import { Server } from "http";

let io: SocketIOServer;

export const initializeSocket = (server: Server) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:3000", process.env.FRONTEND_URL || "*"],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        // User joins room for their role (admin, driver, customer)
        socket.on("join_admin", () => {
            socket.join("admin_room");
            console.log(`Admin joined: ${socket.id}`);
        });

        socket.on("join_driver", (partnerId: string) => {
            socket.join(`driver_${partnerId}`);
            socket.join("all_drivers");
            console.log(`Driver ${partnerId} joined: ${socket.id}`);
        });

        socket.on("join_customer", (userId: string) => {
            socket.join(`customer_${userId}`);
            console.log(`Customer ${userId} joined: ${socket.id}`);
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = (): SocketIOServer => {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }
    return io;
};

// Notification functions
export const notifyNewOrder = (order: any) => {
    const io = getIO();
    
    // Send to admin dashboard
    io.to("admin_room").emit("new_order", {
        orderId: order.id,
        customerId: order.userId,
        customerName: order.user?.name,
        total: order.total,
        items: order.items.length,
        address: order.shippingAddress?.address,
        timestamp: new Date(),
    });

    // Send to all drivers
    io.to("all_drivers").emit("new_order_available", {
        orderId: order.id,
        customerId: order.userId,
        customerName: order.user?.name,
        total: order.total,
        items: order.items.length,
        address: order.shippingAddress?.address,
        timestamp: new Date(),
    });

    // Send to customer
    io.to(`customer_${order.userId}`).emit("order_placed", {
        orderId: order.id,
        status: order.status,
        total: order.total,
        timestamp: new Date(),
    });
};

export const notifyOrderStatusUpdate = (order: any, oldStatus: string) => {
    const io = getIO();
    
    // Send to admin
    io.to("admin_room").emit("order_status_updated", {
        orderId: order.id,
        oldStatus,
        newStatus: order.status,
        deliveryPartner: order.deliveryPartner?.name,
        timestamp: new Date(),
    });

    // Send to assigned driver
    if (order.deliveryPartner) {
        io.to(`driver_${order.deliveryPartnerId}`).emit("order_status_updated", {
            orderId: order.id,
            oldStatus,
            newStatus: order.status,
            timestamp: new Date(),
        });
    }

    // Send to customer
    io.to(`customer_${order.userId}`).emit("order_status_updated", {
        orderId: order.id,
        oldStatus,
        newStatus: order.status,
        timestamp: new Date(),
    });
};

export const notifyDriverAssigned = (order: any) => {
    const io = getIO();
    
    // Send to driver
    if (order.deliveryPartner) {
        io.to(`driver_${order.deliveryPartnerId}`).emit("order_assigned", {
            orderId: order.id,
            customerName: order.user?.name,
            customerPhone: order.user?.phone,
            address: order.shippingAddress?.address,
            items: order.items.length,
            total: order.total,
            timestamp: new Date(),
        });
    }

    // Send to customer
    io.to(`customer_${order.userId}`).emit("driver_assigned", {
        orderId: order.id,
        driverName: order.deliveryPartner?.name,
        driverPhone: order.deliveryPartner?.phone,
        timestamp: new Date(),
    });
};

export const notifyLiveLocationUpdate = (orderId: string, driverId: string, location: { lat: number; lng: number }) => {
    const io = getIO();
    
    // Broadcast to admin and customer for that order
    io.emit(`location_update_${orderId}`, {
        orderId,
        driverId,
        location,
        timestamp: new Date(),
    });
};

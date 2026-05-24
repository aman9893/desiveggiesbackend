import express from "express";
import { searchProducts, getSearchSuggestions, getTrendingSearches } from "../controllers/searchController.js";

const searchRouter = express.Router();

// POST /api/search - Advanced search with filters
searchRouter.post("/", searchProducts);

// GET /api/search/suggestions - Get search suggestions
searchRouter.get("/suggestions", getSearchSuggestions);

// GET /api/search/trending - Get trending searches
searchRouter.get("/trending", getTrendingSearches);

export default searchRouter;

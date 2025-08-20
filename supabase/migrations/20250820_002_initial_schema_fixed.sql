-- Fixed initial schema for IsTheStockMarketOpen.io
-- Migration: 002
-- Created: 2025-08-20
-- Description: Fixed version of initial schema (removed problematic index)

-- This migration fixes the IMMUTABLE function error in the original schema
-- by removing the problematic date range index

-- Drop the problematic index if it exists
DROP INDEX IF EXISTS idx_holidays_date_range;

-- The rest of the schema is the same as 001, this is just a fix
-- No additional changes needed as the main schema in 001 is already correct

-- Fix search path security issue for update_updated_at_column function
-- This makes the function's search path immutable and more secure

-- We rely on CREATE OR REPLACE to update the function definition
-- without dropping it, so dependent triggers remain valid.

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public  -- Explicitly set search path to public schema only
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Recreate the triggers (they should still work with the new function)
-- Note: Triggers are automatically recreated when the function is replaced
-- but we'll explicitly recreate them to be sure

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_markets_updated_at ON markets;
DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
DROP TRIGGER IF EXISTS update_holidays_updated_at ON holidays;
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;

-- Recreate triggers
CREATE TRIGGER update_markets_updated_at 
    BEFORE UPDATE ON markets 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at 
    BEFORE UPDATE ON sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_holidays_updated_at 
    BEFORE UPDATE ON holidays 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at 
    BEFORE UPDATE ON settings 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment explaining the security measure
COMMENT ON FUNCTION public.update_updated_at_column() IS 
'Updates the updated_at column to current timestamp. Search path is locked to public schema for security.';

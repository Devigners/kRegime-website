-- Migration to support multiple images for regimes
-- Change image column from TEXT to TEXT[] to store multiple image URLs

-- First, update existing regimes to convert single image to array format
UPDATE regimes 
SET image = CASE 
    WHEN image IS NOT NULL AND image != '' THEN ('{"' || image || '"}')::TEXT[]
    ELSE '{}'::TEXT[]
END;

-- Alter the table to change image column type
ALTER TABLE regimes 
ALTER COLUMN image TYPE TEXT[] USING 
    CASE 
        WHEN image::TEXT ~ '^\{.*\}$' THEN image::TEXT[]
        WHEN image IS NOT NULL AND image != '' THEN ARRAY[image]
        ELSE '{}'::TEXT[]
    END;

-- Update the column constraint to allow empty arrays
ALTER TABLE regimes 
ALTER COLUMN image SET NOT NULL;
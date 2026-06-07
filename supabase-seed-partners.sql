-- Seed script for CSRIT partners with all 27 organizations
-- This script populates the partners table with complete data
-- Run this AFTER running supabase-create-tables.sql

INSERT INTO partners (id, name, short_name, country, region, category, themes, logo_url, strategic_relevance, initiatives, tier, sort_order) VALUES
-- Tier 1: Inner Ring (6 prominent partners - alphabetical order)
('p001', 'Harvard University', 'Harvard', 'USA', 'North America', 'University', ARRAY['Research & Commercialisation', 'Health & Life Sciences'], NULL, 'Prestigious research and educational institution with world-leading programs', ARRAY[]::text[], 1, 1),
('p002', 'Massachusetts Institute of Technology', 'MIT', 'USA', 'North America', 'University', ARRAY['AI & Sovereign Compute', 'Research & Commercialisation'], NULL, 'World-renowned technology and research institution driving innovation', ARRAY[]::text[], 1, 2),
('p003', 'National Aeronautics and Space Administration', 'NASA', 'USA', 'North America', 'Government Space Agency', ARRAY['Space & Deep Technology', 'Research & Commercialisation'], NULL, 'Leading global space exploration and advanced research agency', ARRAY[]::text[], 1, 3),
('p004', 'Samsung Research', 'Samsung', 'South Korea', 'Asia', 'Technology Company', ARRAY['AI & Sovereign Compute', 'Technology Partners'], NULL, 'Innovation and R&D in semiconductor, AI, and advanced technologies', ARRAY[]::text[], 1, 4),
('p005', 'Sony Research', 'Sony', 'Japan', 'Asia', 'Technology Company', ARRAY['Technology Partners', 'Research & Commercialisation'], NULL, 'Advanced research in electronics, imaging, and digital technologies', ARRAY[]::text[], 1, 5),
('p006', 'Stanford University', 'Stanford', 'USA', 'North America', 'University', ARRAY['AI & Sovereign Compute', 'Research & Commercialisation'], NULL, 'Leading research university in technology, AI, and innovation', ARRAY[]::text[], 1, 6),

-- Tier 2: Outer Ring (21 partners - alphabetical order)
('p007', 'Columbia University', 'Columbia', 'USA', 'North America', 'University', ARRAY['Research & Commercialisation', 'Health & Life Sciences'], NULL, 'Major research university in New York with global influence', ARRAY[]::text[], 2, 7),
('p008', 'European Commission', 'EU Commission', 'Europe', 'Europe', 'Government Institution', ARRAY['Science Diplomacy & International Partnerships', 'Policy & Governance'], NULL, 'Executive body of the European Union driving policy and research', ARRAY[]::text[], 2, 8),
('p009', 'European Space Agency', 'ESA', 'Europe', 'Europe', 'Government Space Agency', ARRAY['Space & Deep Technology', 'Research & Commercialisation'], NULL, 'International organization coordinating European space exploration', ARRAY[]::text[], 2, 9),
('p010', 'G42', 'G42', 'UAE', 'MENA', 'Technology Company', ARRAY['AI & Sovereign Compute', 'Technology Partners'], NULL, 'Advanced computing and sovereign AI solutions provider', ARRAY[]::text[], 2, 10),
('p011', 'Hub71', 'Hub71', 'UAE', 'MENA', 'Startup Ecosystem', ARRAY['Startup & Venture Ecosystem', 'Innovation Diplomacy'], NULL, 'Abu Dhabi''s premier technology innovation and startup hub', ARRAY[]::text[], 2, 11),
('p012', 'IIT Bombay', 'IIT Bombay', 'India', 'Asia', 'University', ARRAY['Research & Commercialisation', 'Education & Training'], NULL, 'Leading Indian institute of technology with global partnerships', ARRAY[]::text[], 2, 12),
('p013', 'Indian Space Research Organisation', 'ISRO', 'India', 'Asia', 'Government Space Agency', ARRAY['Space & Deep Technology', 'Research & Commercialisation'], NULL, 'India''s premier space agency and research organization', ARRAY[]::text[], 2, 13),
('p014', 'Invest Cyprus', 'Invest Cyprus', 'Cyprus', 'Europe', 'Government Institution', ARRAY['Investment & Commercialisation Pathways', 'Innovation Diplomacy'], NULL, 'Promoting foreign investment and business development in Cyprus', ARRAY[]::text[], 2, 14),
('p015', 'Israel Innovation Authority', 'Israel Innovation', 'Israel', 'MENA', 'Government Institution', ARRAY['Research & Commercialisation', 'Innovation Diplomacy'], NULL, 'Driving innovation and entrepreneurship ecosystem in Israel', ARRAY[]::text[], 2, 15),
('p016', 'Japan Science & Technology Agency', 'JSTA', 'Japan', 'Asia', 'Government Institution', ARRAY['Science Diplomacy & International Partnerships', 'Research & Commercialisation'], NULL, 'Promoting scientific advancement and international collaboration', ARRAY[]::text[], 2, 16),
('p017', 'Khazna Data Centers', 'Khazna', 'UAE', 'MENA', 'Technology Infrastructure', ARRAY['AI & Sovereign Compute', 'Technology Partners'], NULL, 'Regional data center and cloud infrastructure leader', ARRAY[]::text[], 2, 17),
('p018', 'LG AI Research', 'LG AI', 'South Korea', 'Asia', 'Technology Company', ARRAY['AI & Sovereign Compute', 'Technology Partners'], NULL, 'Advanced AI research and development center', ARRAY[]::text[], 2, 18),
('p019', 'M42', 'M42', 'UAE', 'MENA', 'Technology Company', ARRAY['AI & Sovereign Compute', 'Technology Partners'], NULL, 'Advanced technology and strategic research initiatives', ARRAY[]::text[], 2, 19),
('p020', 'New Energy and Industrial Technology Development Organization', 'NEDO', 'Japan', 'Asia', 'Government Agency', ARRAY['Technology Partners', 'Research & Commercialisation'], NULL, 'Japan''s energy and industrial technology development leader', ARRAY[]::text[], 2, 20),
('p021', 'Northwestern University', 'Northwestern', 'USA', 'North America', 'University', ARRAY['Research & Commercialisation', 'AI & Sovereign Compute'], NULL, 'Leading engineering and research university', ARRAY[]::text[], 2, 21),
('p022', 'Plug and Play Tech Center', 'Plug and Play', 'USA', 'North America', 'Startup Ecosystem', ARRAY['Startup & Venture Ecosystem', 'Innovation Diplomacy'], NULL, 'Global innovation platform and startup accelerator network', ARRAY[]::text[], 2, 22),
('p023', 'Reliance Jio', 'Reliance Jio', 'India', 'Asia', 'Technology Company', ARRAY['Technology Partners', 'Startup & Venture Ecosystem'], NULL, 'India''s leading digital infrastructure and connectivity provider', ARRAY[]::text[], 2, 23),
('p024', 'Research & Innovation Foundation Cyprus', 'RIF Cyprus', 'Cyprus', 'Europe', 'Government Institution', ARRAY['Research & Commercialisation', 'Innovation Diplomacy'], NULL, 'Supporting research and innovation in Cyprus', ARRAY[]::text[], 2, 24),
('p025', 'RIKEN', 'RIKEN', 'Japan', 'Asia', 'Research Institute', ARRAY['Research & Commercialisation', 'AI & Sovereign Compute'], NULL, 'Japan''s leading comprehensive research institute', ARRAY[]::text[], 2, 25),
('p026', 'Tensortent', 'Tensortent', 'Cyprus', 'Europe', 'Technology Startup', ARRAY['Startup & Venture Ecosystem', 'Technology Partners'], NULL, 'Cyprus-based technology innovation and development startup', ARRAY[]::text[], 2, 26),
('p027', 'University of Melbourne', 'Melbourne', 'Australia', 'Oceania', 'University', ARRAY['Research & Commercialisation', 'Education & Training'], NULL, 'Leading Australian research university with global partnerships', ARRAY[]::text[], 2, 27);

-- Verify all partners were inserted
SELECT COUNT(*) as total_partners, 
       SUM(CASE WHEN tier = 1 THEN 1 ELSE 0 END) as tier_1_count,
       SUM(CASE WHEN tier = 2 THEN 1 ELSE 0 END) as tier_2_count
FROM partners;

-- Show all partners ordered by tier and sort_order
SELECT id, short_name, tier, sort_order FROM partners ORDER BY tier, sort_order;

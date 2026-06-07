-- Seed script for CSRIT partners
-- Copy and paste this into your Supabase SQL editor to populate all partners

INSERT INTO partners (id, name, short_name, country, region, category, themes, logo_url, strategic_relevance, initiatives, tier, sort_order) VALUES
-- Tier 1: Inner Ring (6 prominent partners - alphabetical order)
('01', 'National Aeronautics and Space Administration', 'NASA', 'USA', 'North America', 'Government Space Agency', ARRAY['Space & Deep Technology', 'Research & Commercialisation'], NULL, 'Leading global space exploration and research', ARRAY[]::text[], 1, 1),
('02', 'Harvard University', 'Harvard', 'USA', 'North America', 'University', ARRAY['Research & Commercialisation', 'Health & Life Sciences'], NULL, 'Prestigious research and educational institution', ARRAY[]::text[], 1, 2),
('03', 'Massachusetts Institute of Technology', 'MIT', 'USA', 'North America', 'University', ARRAY['AI & Sovereign Compute', 'Research & Commercialisation'], NULL, 'World-renowned technology and research institution', ARRAY[]::text[], 1, 3),
('04', 'Samsung Research', 'Samsung', 'South Korea', 'Asia', 'Technology Company', ARRAY['AI & Sovereign Compute', 'Technology Partners'], NULL, 'Innovation and R&D in semiconductor and AI', ARRAY[]::text[], 1, 4),
('05', 'Sony Research', 'Sony', 'Japan', 'Asia', 'Technology Company', ARRAY['Technology Partners', 'Research & Commercialisation'], NULL, 'Advanced research in electronics and imaging', ARRAY[]::text[], 1, 5),
('06', 'Stanford University', 'Stanford', 'USA', 'North America', 'University', ARRAY['AI & Sovereign Compute', 'Research & Commercialisation'], NULL, 'Leading research university in technology and innovation', ARRAY[]::text[], 1, 6),

-- Tier 2: Outer Ring (21 partners - alphabetical order)
('07', 'Columbia University', 'Columbia', 'USA', 'North America', 'University', ARRAY['Research & Commercialisation', 'Health & Life Sciences'], NULL, 'Major research university in New York', ARRAY[]::text[], 2, 7),
('08', 'European Commission', 'EU Commission', 'Europe', 'Europe', 'Government Institution', ARRAY['Science Diplomacy & International Partnerships', 'Policy & Governance'], NULL, 'Executive branch of the European Union', ARRAY[]::text[], 2, 8),
('09', 'European Space Agency', 'ESA', 'Europe', 'Europe', 'Government Space Agency', ARRAY['Space & Deep Technology', 'Research & Commercialisation'], NULL, 'Coordinating space exploration in Europe', ARRAY[]::text[], 2, 9),
('10', 'G42', 'G42', 'UAE', 'MENA', 'Technology Company', ARRAY['AI & Sovereign Compute', 'Technology Partners'], NULL, 'Advanced computing and AI solutions provider', ARRAY[]::text[], 2, 10),
('11', 'Hub71', 'Hub71', 'UAE', 'MENA', 'Startup Ecosystem', ARRAY['Startup & Venture Ecosystem', 'Innovation Diplomacy'], NULL, 'Abu Dhabi''s technology innovation hub', ARRAY[]::text[], 2, 11),
('12', 'IIT Bombay', 'IIT Bombay', 'India', 'Asia', 'University', ARRAY['Research & Commercialisation', 'Education & Training'], NULL, 'Leading Indian institute of technology', ARRAY[]::text[], 2, 12),
('13', 'Indian Space Research Organisation', 'ISRO', 'India', 'Asia', 'Government Space Agency', ARRAY['Space & Deep Technology', 'Research & Commercialisation'], NULL, 'India''s space agency and research organization', ARRAY[]::text[], 2, 13),
('14', 'Invest Cyprus', 'Invest Cyprus', 'Cyprus', 'Europe', 'Government Institution', ARRAY['Investment & Commercialisation Pathways', 'Innovation Diplomacy'], NULL, 'Promoting investment and business in Cyprus', ARRAY[]::text[], 2, 14),
('15', 'Israel Innovation Authority', 'Israel Innovation', 'Israel', 'MENA', 'Government Institution', ARRAY['Research & Commercialisation', 'Innovation Diplomacy'], NULL, 'Driving innovation and entrepreneurship in Israel', ARRAY[]::text[], 2, 15),
('16', 'Japan Science & Technology Agency', 'JSTA', 'Japan', 'Asia', 'Government Institution', ARRAY['Science Diplomacy & International Partnerships', 'Research & Commercialisation'], NULL, 'Promoting scientific advancement in Japan', ARRAY[]::text[], 2, 16),
('17', 'Khazna Data Centers', 'Khazna', 'UAE', 'MENA', 'Technology Infrastructure', ARRAY['AI & Sovereign Compute', 'Technology Partners'], NULL, 'Data center and cloud infrastructure provider', ARRAY[]::text[], 2, 17),
('18', 'LG AI Research', 'LG AI', 'South Korea', 'Asia', 'Technology Company', ARRAY['AI & Sovereign Compute', 'Technology Partners'], NULL, 'Advanced AI research and development', ARRAY[]::text[], 2, 18),
('19', 'M42', 'M42', 'UAE', 'MENA', 'Technology Company', ARRAY['AI & Sovereign Compute', 'Technology Partners'], NULL, 'Advanced technology and research initiatives', ARRAY[]::text[], 2, 19),
('20', 'New Energy and Industrial Technology Development Organization', 'NEDO', 'Japan', 'Asia', 'Government Agency', ARRAY['Technology Partners', 'Research & Commercialisation'], NULL, 'Japan''s energy and industrial technology development', ARRAY[]::text[], 2, 20),
('21', 'Northwestern University', 'Northwestern', 'USA', 'North America', 'University', ARRAY['Research & Commercialisation', 'AI & Sovereign Compute'], NULL, 'Leading engineering and research university', ARRAY[]::text[], 2, 21),
('22', 'Plug and Play Tech Center', 'Plug and Play', 'USA', 'North America', 'Startup Ecosystem', ARRAY['Startup & Venture Ecosystem', 'Innovation Diplomacy'], NULL, 'Global innovation platform and accelerator', ARRAY[]::text[], 2, 22),
('23', 'Reliance Jio', 'Reliance Jio', 'India', 'Asia', 'Technology Company', ARRAY['Technology Partners', 'Startup & Venture Ecosystem'], NULL, 'India''s leading digital infrastructure provider', ARRAY[]::text[], 2, 23),
('24', 'Research & Innovation Foundation Cyprus', 'RIF Cyprus', 'Cyprus', 'Europe', 'Government Institution', ARRAY['Research & Commercialisation', 'Innovation Diplomacy'], NULL, 'Supporting research and innovation in Cyprus', ARRAY[]::text[], 2, 24),
('25', 'RIKEN', 'RIKEN', 'Japan', 'Asia', 'Research Institute', ARRAY['Research & Commercialisation', 'AI & Sovereign Compute'], NULL, 'Japan''s leading research institute', ARRAY[]::text[], 2, 25),
('26', 'Tensortent', 'Tensortent', 'Cyprus', 'Europe', 'Technology Startup', ARRAY['Startup & Venture Ecosystem', 'Technology Partners'], NULL, 'Cyprus-based technology innovation startup', ARRAY[]::text[], 2, 26),
('27', 'University of Melbourne', 'Melbourne', 'Australia', 'Oceania', 'University', ARRAY['Research & Commercialisation', 'Education & Training'], NULL, 'Leading Australian research university', ARRAY[]::text[], 2, 27);

-- Verify the data was inserted
SELECT COUNT(*) as total_partners FROM partners;

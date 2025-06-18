
-- First, let's create the management tables without the phone constraint
CREATE TABLE IF NOT EXISTS public.universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  state text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.route_vehicle_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_location text NOT NULL,
  to_location text NOT NULL,
  vehicle_type text NOT NULL,
  base_price numeric NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(from_location, to_location, vehicle_type)
);

-- Insert default Nigerian states
INSERT INTO public.states (name) VALUES
  ('Lagos'), ('Abuja'), ('Kano'), ('Rivers'), ('Oyo'), ('Kaduna'), 
  ('Katsina'), ('Ogun'), ('Ondo'), ('Imo'), ('Delta'), ('Edo'), 
  ('Enugu'), ('Anambra'), ('Abia'), ('Bauchi'), ('Benue'), ('Borno'), 
  ('Cross River'), ('Ebonyi'), ('Ekiti'), ('Gombe'), ('Jigawa'), 
  ('Kebbi'), ('Kogi'), ('Kwara'), ('Nasarawa'), ('Niger'), ('Osun'), 
  ('Plateau'), ('Sokoto'), ('Taraba'), ('Yobe'), ('Zamfara'), 
  ('Adamawa'), ('Akwa Ibom'), ('Bayelsa')
ON CONFLICT (name) DO NOTHING;

-- Insert default Nigerian universities
INSERT INTO public.universities (name, state) VALUES
  ('University of Lagos (UNILAG)', 'Lagos'),
  ('University of Ibadan (UI)', 'Oyo'), 
  ('Obafemi Awolowo University (OAU)', 'Osun'),
  ('University of Nigeria, Nsukka (UNN)', 'Enugu'),
  ('Ahmadu Bello University (ABU)', 'Kaduna'),
  ('University of Port Harcourt (UNIPORT)', 'Rivers'),
  ('Federal University of Technology, Akure (FUTA)', 'Ondo'),
  ('Lagos State University (LASU)', 'Lagos'),
  ('Covenant University', 'Ogun'),
  ('Babcock University', 'Ogun'),
  ('University of Benin (UNIBEN)', 'Edo'),
  ('Federal University of Technology, Owerri (FUTO)', 'Imo'),
  ('University of Ilorin (UNILORIN)', 'Kwara'),
  ('Nnamdi Azikiwe University (UNIZIK)', 'Anambra'),
  ('Federal University, Oye-Ekiti (FUOYE)', 'Ekiti'),
  ('University of Calabar (UNICAL)', 'Cross River'),
  ('Bayero University, Kano (BUK)', 'Kano'),
  ('University of Jos (UNIJOS)', 'Plateau'),
  ('Delta State University (DELSU)', 'Delta'),
  ('Rivers State University (RSU)', 'Rivers'),
  ('Afe Babalola University, Ado-Ekiti', 'Ekiti'),
  ('Redeemer''s University, Ede', 'Osun'),
  ('Bowen University, Iwo', 'Osun'), 
  ('Lead City University, Ibadan', 'Oyo'),
  ('Pan-Atlantic University, Lagos', 'Lagos'),
  ('Landmark University, Omu-Aran', 'Kwara'),
  ('American University of Nigeria, Yola', 'Adamawa'),
  ('Imo State University (IMSU)', 'Imo'),
  ('Abia State University (ABSU)', 'Abia'),
  ('Enugu State University of Science and Technology (ESUT)', 'Enugu'),
  ('Anambra State University (ANSU)', 'Anambra'),
  ('Ekiti State University (EKSU)', 'Ekiti'),
  ('Adekunle Ajasin University (AAU)', 'Ondo'),
  ('Federal University of Agriculture, Abeokuta (FUNAAB)', 'Ogun'),
  ('University of Agriculture, Makurdi (UAM)', 'Benue'),
  ('Federal University of Petroleum Resources, Effurun (FUPRE)', 'Delta'),
  ('Federal University, Birnin Kebbi (FUBK)', 'Kebbi'),
  ('Bells University of Technology', 'Ogun'),
  ('Crawford University', 'Ogun'),
  ('Mountain Top University', 'Ogun'),
  ('Igbinedion University', 'Edo')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS on new tables
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.route_vehicle_pricing ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Universities are publicly readable" ON public.universities FOR SELECT USING (true);
CREATE POLICY "States are publicly readable" ON public.states FOR SELECT USING (true);
CREATE POLICY "Route pricing is publicly readable" ON public.route_vehicle_pricing FOR SELECT USING (true);

-- Admin policies (will be used later when admin authentication is implemented)
CREATE POLICY "Admins can manage universities" ON public.universities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage states" ON public.states FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage pricing" ON public.route_vehicle_pricing FOR ALL USING (true) WITH CHECK (true);

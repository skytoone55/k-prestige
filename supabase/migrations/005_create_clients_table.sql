-- Migration: Create clients table for devis requests
-- Run this in Supabase SQL Editor

-- Table pour les demandes de devis / clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  nb_adultes INTEGER DEFAULT 2,
  nb_bebes INTEGER DEFAULT 0,
  nb_enfants_2_3ans INTEGER DEFAULT 0,
  nb_enfants_4_6ans INTEGER DEFAULT 0,
  nb_enfants_7_11ans INTEGER DEFAULT 0,
  statut TEXT DEFAULT 'NOUVEAU',
  montant_du DECIMAL(10,2),
  info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_clients_created ON clients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clients_statut ON clients(statut);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- RLS (Row Level Security)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour clients (accès public complet pour le moment)
CREATE POLICY "Public read access" ON clients FOR SELECT USING (true);
CREATE POLICY "Public write access" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON clients FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete access" ON clients FOR DELETE USING (true);

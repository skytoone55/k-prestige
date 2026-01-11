'use client';

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { PageEditorFull } from '@/components/admin/PageEditorFull';
import { GalerieManager } from '@/components/admin/GalerieManager';

export default function AdminDashboard() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Menu latéral gauche */}
      <AdminSidebar selectedPage={selectedPage} onSelectPage={setSelectedPage} />
      
      {/* Zone d'édition droite */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {selectedPage === 'galerie' ? (
          <GalerieManager />
        ) : selectedPage ? (
          <PageEditorFull pageId={selectedPage} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-xl text-gray-500 mb-2">Sélectionnez une page à modifier</p>
              <p className="text-sm text-gray-400">Utilisez le menu de gauche</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

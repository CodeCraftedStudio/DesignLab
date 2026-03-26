import React from 'react';
import Layout from '@/components/Layout';
import { Hammer } from 'lucide-react';

export default function PlaceholderTool({ name }: { name: string }) {
  const Sidebar = (
    <div className="p-6">
      <h2 className="font-display font-bold text-lg mb-4">{name} Controls</h2>
      <p className="text-muted-foreground text-sm">Settings for {name} will appear here.</p>
    </div>
  );

  return (
    <Layout sidebar={Sidebar}>
      <div className="h-full flex items-center justify-center bg-card/50">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto text-primary">
            <Hammer size={32} />
          </div>
          <h1 className="text-2xl font-display font-bold">{name} Tool</h1>
          <p className="text-muted-foreground">
            This module is being initialized. Use the Colors, Typography, Canvas, or Code Editor tabs for full functionality previews.
          </p>
        </div>
      </div>
    </Layout>
  );
}

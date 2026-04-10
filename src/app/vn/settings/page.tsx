"use client";
// @ts-nocheck

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Users,
  UserCog,
  LogOut,
} from 'lucide-react';
import { PageContainer } from '@/components/vn/layout/page-container';
import { Header } from '@/components/vn/layout/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/vn/ui/card';
import { Badge } from '@/components/vn/ui/badge';

// --- MOCK DATA ---
const MOCK_CREATORS_COUNT = 12;
const isAdmin = true;

export default function SettingsPage() {
  const handleSignOut = async () => {
    // no-op
  };

  return (
    <PageContainer>
      <Header
        title="Settings"
        description="Manage your workspace and team"
      />

      <div className="space-y-6">
        {/* Quick Actions - Admin Only */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href="/vn/settings/creators">
                <Card className="p-6 hover:bg-zinc-800/70 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-orange-500/10">
                      <Users className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-100">Creator Management</h3>
                      <p className="text-sm text-zinc-400">{MOCK_CREATORS_COUNT} creators tracked</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Link href="/vn/settings/users">
                <Card className="p-6 hover:bg-zinc-800/70 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <UserCog className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-100">User Management</h3>
                      <p className="text-sm text-zinc-400">Manage team members and access</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          </div>
        )}

        {/* Data Source Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-100 font-medium">Data Source</p>
                    <p className="text-sm text-zinc-400">Mock data mode enabled</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Demo Mode
                  </Badge>
                </div>
                <div className="pt-4 border-t border-zinc-800">
                  <p className="text-sm text-zinc-500">CR Dashboard v1.0.0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-red-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-100 font-semibold">Sign Out</p>
                  <p className="text-sm text-zinc-400">Sign out of your account on this device</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageContainer>
  );
}

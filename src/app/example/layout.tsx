import ExampleSidebar from '@/app/example/components/ExampleSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TopNavbar } from './components/TopNavbar';
import AuthProvider from '@/components/auth/AuthProvider';

export default function ExampleLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <div className="h-screen flex flex-col">
                <TopNavbar />
                <div className="flex-1 flex">
                    <SidebarProvider
                        style={
                            {
                                '--sidebar-width': 'calc(var(--spacing) * 72)',
                                '--header-height': 'calc(var(--spacing) * 14)',
                            } as React.CSSProperties
                        }
                    >
                        <ExampleSidebar />
                        <SidebarInset>
                            <div className="@container/main h-full">
                                <div className="flex flex-col gap-4 md:gap-6 p-4 lg:p-6 h-full">
                                    {children}
                                </div>
                            </div>
                        </SidebarInset>
                    </SidebarProvider>
                </div>
            </div>
        </AuthProvider>
    );
}

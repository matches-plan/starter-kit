'use client';
import * as React from 'react';
import {
    IconFolder,
} from '@tabler/icons-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
} from '@/components/ui/sidebar';
import { NavMain } from '@/app/example/components/NavMain';

const data = {
    navMain: [
        {
            title: 'Object Storage',
            url: '#',
            icon: IconFolder,
            pathname: '/example/object_storage',
        },
    ],
};

export default function ExampleSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            collapsible="offcanvas"
            {...props}
        >
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter></SidebarFooter>
        </Sidebar>
    );
}

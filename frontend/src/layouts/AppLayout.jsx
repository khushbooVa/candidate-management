import { Outlet } from 'react-router-dom';

const AppLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Main Content Area */}
            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;

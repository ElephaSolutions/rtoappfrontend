
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Construction } from 'lucide-react';
import { useBusinessConfig } from '@/hooks/useBusinessConfig';

const LicenseView = () => {
  const { config } = useBusinessConfig();

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div 
        className="min-h-screen fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, var(--color-bg, #F8FAFC) 0%, #E2E8F0 100%)'
        }}
      />
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: config?.theme.primary }}
              >
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">License Management</CardTitle>
                <p className="text-gray-600 mt-1">View and manage driving licenses</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="text-center py-16">
              <Construction className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                License management features are currently under development. 
                This section will allow you to view and manage driving license records.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LicenseView;

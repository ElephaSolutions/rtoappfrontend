
import VehicleTable from '@/components/VehicleTable';

const VehicleView = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div 
        className="min-h-screen fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, var(--color-bg, #F8FAFC) 0%, #E2E8F0 100%)'
        }}
      />
      <div className="max-w-7xl mx-auto">
        <VehicleTable />
      </div>
    </div>
  );
};

export default VehicleView;

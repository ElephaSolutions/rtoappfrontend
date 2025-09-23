
import VehicleForm from '@/components/VehicleForm';

const Vehicle = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div 
        className="min-h-screen fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, var(--color-bg, #F8FAFC) 0%, #E2E8F0 100%)'
        }}
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Vehicle Record</h1>
          <p className="text-gray-600">Enter detailed information for vehicle documentation</p>
        </div>
        <VehicleForm />
      </div>
    </div>
  );
};

export default Vehicle;

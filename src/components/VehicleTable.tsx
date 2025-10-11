
import { useState, useEffect } from 'react';
import { useBusinessConfig } from '@/hooks/useBusinessConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Search, Calendar, Phone, Car, NavigationOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import VehicleForm from './VehicleForm';
import {VehicleFormData} from './VehicleForm'
import { useNavigate } from 'react-router-dom';

interface Vehicle {
  id: number;
  vehicleNo: string;
  fitnessValid: string;
  insuranceValid: string;
  permitValid: string;
  taxValid: string;
  pucValid: string;
  contactNumber: string;
}

interface VehicleResponseItem {
  vehicleNumber: string,
  fcExpiryDate: string,
  insuranceExpiryDate: string,
  permitExpiryDate: string,
  taxDueDate: string,
  pollutionCertificateExpiryDate: string,
  contactNumber: string,
}

interface VehicleResponseBody {
  vehicles: VehicleResponseItem[],
  totalVehicles: number,
}

const BACKEND_URL = "https://rtoappbyourself.onrender.com/api/v1/vehicle";
const PAGE_QUERY_PARAM = "page";
const PAGE_SIZE_QUERY_PARAM = "page_size";

const VehicleTable = () => {
  const { config } = useBusinessConfig();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalVehicleItems, setTotalVehicleItems] = useState(0)
  const [vehicleFormEnabled, setVehicleFormEnabled] = useState(false)
  const [vehicleDataToUpdate, setVehicleDataToUpdate] = useState<VehicleFormData>()
  const navigate = useNavigate()
  
  const itemsPerPage = 10;

  useEffect(() => {
    loadVehicles();
  }, [currentPage, totalVehicleItems, vehicleFormEnabled]);

  const loadVehicles = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}?${PAGE_QUERY_PARAM}=${currentPage}&${PAGE_SIZE_QUERY_PARAM}=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include'
        }
      );
      if (response.status === 401 || response.status === 403)
        navigate("/login")
      const data: VehicleResponseBody = await response.json();
      setVehicles(data.vehicles.map(
        (vehicle, index) => {
          return {
            id: index,
            vehicleNo: vehicle.vehicleNumber,
            fitnessValid: new Date(vehicle.fcExpiryDate).toDateString(),
            insuranceValid: new Date(vehicle.insuranceExpiryDate).toDateString(),
            permitValid: new Date(vehicle.permitExpiryDate).toDateString(),
            taxValid: new Date(vehicle.taxDueDate).toDateString(),
            pucValid: new Date(vehicle.pollutionCertificateExpiryDate).toDateString(),
            contactNumber: vehicle.contactNumber,
          }
        }
      ));
      setTotalVehicleItems(data.totalVehicles)
    } catch (error) {
      console.error('Failed to load vehicles:', error);
      toast({
        title: "Error",
        description: "Failed to load vehicle data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const parseAndGetDateStringForForm = (date: string): string => {
    const dateInstance = new Date(Date.parse(date))
    const year = dateInstance.getFullYear();
    const month = String(dateInstance.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(dateInstance.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`
  }

  const handleUpdate = (vehicle: Vehicle) => {
    const vehicleFormData: VehicleFormData = {
      vehicleNo: vehicle.vehicleNo,
      fitnessValid: parseAndGetDateStringForForm(vehicle.fitnessValid),
      insuranceValid: parseAndGetDateStringForForm(vehicle.insuranceValid),
      permitValid: parseAndGetDateStringForForm(vehicle.permitValid),
      taxValid: parseAndGetDateStringForForm(vehicle.taxValid),
      pucValid: parseAndGetDateStringForForm(vehicle.pucValid),
      contactNumber: vehicle.contactNumber
    }
    console.log(vehicleFormData)
    setVehicleDataToUpdate(vehicleFormData)
    setVehicleFormEnabled(true)
  }

  const handleDelete = (vehicleNumber: string) => {
    fetch(
      BACKEND_URL,
      {
        method: "DELETE",
        credentials: 'include',
        headers: {
          "vehicle_number": vehicleNumber
        },
      }
    ).then(
      response => {
        if(response.ok) {
          toast({
            title: "Success",
            description: "Vehicle record deleted successfully"
          });
          setTotalVehicleItems(currentValue => currentValue - 1)
        } else {
          toast({
            title: "Error",
            description: `Failed to delete vehicle ${vehicleNumber}`,
            variant: "destructive"
          });
        }
      }
    )
  };

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const isExpiringSoon = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return date <= thirtyDaysFromNow && date >= today;
  };

  const getValidityBadge = (dateString: string) => {
    if (isExpired(dateString)) {
      return <Badge variant="destructive" className="text-xs">Expired</Badge>;
    }
    if (isExpiringSoon(dateString)) {
      return <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">Expiring Soon</Badge>;
    }
    return <Badge variant="default" className="text-xs bg-green-100 text-green-800">Valid</Badge>;
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.contactNumber.includes(searchTerm)
  );

  const totalPages = Math.ceil(totalVehicleItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: config?.theme.primary }}
                >
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Vehicle Records</CardTitle>
                  <p className="text-gray-600 mt-1">{totalVehicleItems} vehicles found</p>
                </div>
              </div>
              
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No vehicles found</p>
                <p className="text-gray-400">Add your first vehicle record to get started</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-black text-xl text-gray-700">Vehicle No</th>
                        <th className="text-left py-3 px-4 font-black text-xl text-gray-700">Fitness</th>
                        <th className="text-left py-3 px-4 font-black text-xl text-gray-700">Insurance</th>
                        <th className="text-left py-3 px-4 font-black text-xl text-gray-700">Permit</th>
                        <th className="text-left py-3 px-4 font-black text-xl text-gray-700">Tax</th>
                        <th className="text-left py-3 px-4 font-black text-xl text-gray-700">PUC</th>
                        <th className="text-left py-3 px-4 font-black text-xl text-gray-700">Contact</th>
                        <th className="text-left py-3 px-4 font-black text-xl text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVehicles.map((vehicle, index) => (
                        <tr key={vehicle.id} className={"border-b transition-colors " + ((index % 2 === 0) ? "bg-gray-100": "bg-gray-300")}>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">{vehicle.vehicleNo}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-600">{vehicle.fitnessValid}</div>
                              {getValidityBadge(vehicle.fitnessValid)}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-600">{vehicle.insuranceValid}</div>
                              {getValidityBadge(vehicle.insuranceValid)}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-600">{vehicle.permitValid}</div>
                              {getValidityBadge(vehicle.permitValid)}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-600">{vehicle.taxValid}</div>
                              {getValidityBadge(vehicle.taxValid)}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-600">{vehicle.pucValid}</div>
                              {getValidityBadge(vehicle.pucValid)}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{vehicle.contactNumber}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="p-2 h-8 w-8"
                                onClick={() => handleUpdate(vehicle)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="p-2 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(vehicle.vehicleNo)}
                              >
                                <Trash className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, startIndex + filteredVehicles.length)} of {totalVehicleItems} vehicles
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      {
        vehicleFormEnabled && 
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-lg'>
          <VehicleForm formDataValues={vehicleDataToUpdate} onSubmit={() => setVehicleFormEnabled(false)}/>
        </div>
      }
    </>
  );
};

export default VehicleTable;

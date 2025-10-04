
import { useState } from 'react';
import { useBusinessConfig } from '@/hooks/useBusinessConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Car, Calendar, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface VehicleFormData {
  vehicleNo: string;
  fitnessValid: string;
  insuranceValid: string;
  permitValid: string;
  taxValid: string;
  pucValid: string;
  contactNumber: string;
}

interface VehicleRequestBody {
    vehicleNumber: string,
    fcExpiryDate: string,
    insuranceExpiryDate: string,
    permitExpiryDate: string,
    taxDueDate: string,
    pollutionCertificateExpiryDate: string,
    contactNumber: string,
}

const BACKEND_URL = "https://rtoappbyourself.onrender.com/api/v1/vehicle";

const emptyFormDataValues: VehicleFormData = {
  vehicleNo: '',
  fitnessValid: '',
  insuranceValid: '',
  permitValid: '',
  taxValid: '',
  pucValid: '',
  contactNumber: ''
}

const VehicleForm = ({formDataValues = emptyFormDataValues, onSubmit = () => {}}: {formDataValues: VehicleFormData, onSubmit: () => void}) => {
  const { config } = useBusinessConfig();
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicleNo: formDataValues.vehicleNo,
    fitnessValid: formDataValues.fitnessValid,
    insuranceValid: formDataValues.insuranceValid,
    permitValid: formDataValues.permitValid,
    taxValid: formDataValues.taxValid,
    pucValid: formDataValues.pucValid,
    contactNumber: formDataValues.contactNumber
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['vehicleNo', 'fitnessValid', 'insuranceValid', 'permitValid', 'taxValid', 'pucValid', 'contactNumber'];
    const missing = required.filter(field => !formData[field as keyof VehicleFormData]);
    
    if (missing.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missing.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }

    // Validate phone number
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.contactNumber.replace(/\s/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    const requestBody: VehicleRequestBody = {  
      vehicleNumber: formData.vehicleNo,
      fcExpiryDate: formData.fitnessValid,
      insuranceExpiryDate: formData.insuranceValid,
      permitExpiryDate: formData.permitValid,
      taxDueDate: formData.taxValid,
      pollutionCertificateExpiryDate: formData.pucValid,
      contactNumber: formData.contactNumber,
    }

    try {
      // Simulate API call - in real app, this would save to backend
      const response = await fetch(
          BACKEND_URL,
          {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
              "Content-Type": "application/json"
            },
            credentials: 'include'
          }
        );
      if (response.status === 200)
        toast({
          title: "Success!",
          description: "Vehicle record has been saved successfully.",
        });
      else if (response.status === 401 || response.status === 403)
        navigate("/login")
      else
        throw new Error(`Received response with status code ${response.status}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save vehicle record. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Reset form
      setFormData({
        vehicleNo: '',
        fitnessValid: '',
        insuranceValid: '',
        permitValid: '',
        taxValid: '',
        pucValid: '',
        contactNumber: ''
      });
      setIsSubmitting(false);
      onSubmit()
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: config?.theme.primary }}
            >
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Add New Vehicle</CardTitle>
              <p className="text-gray-600 mt-1">Enter vehicle details and validity dates</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="vehicleNo" className="text-sm font-medium text-gray-700">
                  Vehicle Number *
                </Label>
                <Input
                  id="vehicleNo"
                  name="vehicleNo"
                  value={formData.vehicleNo}
                  onChange={handleChange}
                  placeholder="e.g., KA05MX1234"
                  className="mt-1.5 h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="fitnessValid" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Fitness Valid Until *</span>
                </Label>
                <Input
                  id="fitnessValid"
                  name="fitnessValid"
                  type="date"
                  value={formData.fitnessValid}
                  onChange={handleChange}
                  className="mt-1.5 h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="insuranceValid" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Insurance Valid Until *</span>
                </Label>
                <Input
                  id="insuranceValid"
                  name="insuranceValid"
                  type="date"
                  value={formData.insuranceValid}
                  onChange={handleChange}
                  className="mt-1.5 h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="permitValid" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Permit Valid Until *</span>
                </Label>
                <Input
                  id="permitValid"
                  name="permitValid"
                  type="date"
                  value={formData.permitValid}
                  onChange={handleChange}
                  className="mt-1.5 h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="taxValid" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Tax Valid Until *</span>
                </Label>
                <Input
                  id="taxValid"
                  name="taxValid"
                  type="date"
                  value={formData.taxValid}
                  onChange={handleChange}
                  className="mt-1.5 h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="pucValid" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>PUC Valid Until *</span>
                </Label>
                <Input
                  id="pucValid"
                  name="pucValid"
                  type="date"
                  value={formData.pucValid}
                  onChange={handleChange}
                  className="mt-1.5 h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Contact Number *</span>
                </Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="mt-1.5 h-11"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                style={{ backgroundColor: config?.theme.primary }}
              >
                {isSubmitting ? 'Saving...' : 'Save Vehicle Record'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleForm;

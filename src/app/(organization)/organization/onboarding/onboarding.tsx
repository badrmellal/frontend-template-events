import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Briefcase, Building, MapPin, Phone, FileText, ChevronRight, ChevronLeft, AlertTriangle, Flag, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import ReactCountryFlag from "react-country-flag"
import { Country, africanCountries, formatCurrency } from '@/app/api/currency/route'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface FormData {
  country: string;
  registrationNumber: string;
  [key: string]: string; 
}

interface RegistrationNumberFieldProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
}

const OrganizationOnboarding: React.FC = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    organizationName: '',
    address: '',
    city: '',
    country: '',
    phoneNumber: '',
    businessCategory: '',
    registrationNumber: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();


  const getRegistrationNumberTooltip = (country: string) => {
    const tooltips: { [key: string]: string } = {
        "NG": "RC Number for Nigeria",
        "KE": "KRA PIN for Kenya",
        "ZA": "CIPC Registration Number for South Africa",
        "GH": "Tax Identification Number (TIN) for Ghana",
        "MA": "Identifiant Commun de l'Entreprise (ICE) for Morocco",
        "EG": "Tax Registration Number for Egypt",
        "DZ": "Numéro d'Immatriculation Fiscale (NIF) for Algeria",
        "TZ": "Tax Identification Number (TIN) for Tanzania",
        "TN": "Matricule Fiscal for Tunisia",
        "MR": "Numéro d'Immatriculation Fiscale (NIF) for Mauritania",
        "SN": "NINEA (Numéro d'Identification Nationale des Entreprises et Associations) for Senegal",
        "CG": "Numéro d'Immatriculation au Registre du Commerce et du Crédit Mobilier (RCCM) for Congo",
        "CM": "Numéro du Registre de Commerce for Cameroon",
        "CI": "Numéro du Registre du Commerce et du Crédit Mobilier (RCCM) for Côte d'Ivoire",
        "GA": "Numéro d'Immatriculation au Registre du Commerce (RC) for Gabon",
        "ZW": "Business Partner Number (BP Number) for Zimbabwe",
        "ET": "Tax Identification Number (TIN) for Ethiopia"
    };

    return tooltips[country] || "Registration Number";
};

  
  const RegistrationNumberField = ({ formData, handleInputChange, errors }:RegistrationNumberFieldProps )=> {
    const tooltipText = getRegistrationNumberTooltip(formData.country);
  
    return (
      <div className="space-y-2">
        <Label htmlFor="registrationNumber" className="flex items-center text-gray-400 space-x-2">
          <FileText className="h-4 w-4 text-gray-400" />
          <span>Company Registration Number</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <Input 
          id="registrationNumber" 
          name="registrationNumber"
          type="text"
          value={formData.registrationNumber} 
          onChange={handleInputChange} 
          className={errors.registrationNumber ? 'border-red-500' : 'text-white'}
        />
        {errors.registrationNumber && <p className="text-red-500 text-xs">{errors.registrationNumber}</p>}
      </div>
    );
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setShowAlert(false)
  }, [])

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setShowAlert(false)
  }, [])

  const validateStep = useCallback(() => {
    const newErrors: Record<string, string> = {}
    const currentFields = Object.keys(formData).filter(key => {
      if (step === 1) return ['firstName', 'lastName', 'jobTitle'].includes(key)
      if (step === 2) return ['organizationName', 'address', 'city', 'country'].includes(key)
      return ['phoneNumber', 'businessCategory', 'registrationNumber'].includes(key)
    })

    currentFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = 'This field is required'
      }
    })

    if (step === 3 && formData.phoneNumber) {
      const selectedCountry = africanCountries.find(c => c.code === formData.country)
      if (selectedCountry && !formData.phoneNumber.startsWith(selectedCountry.dial_code)) {
        newErrors.phoneNumber = `Phone number should start with ${selectedCountry.dial_code}`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [step, formData])

  const handleNext = useCallback(() => {
    if (validateStep()) {
      setStep(prev => prev + 1)
      setShowAlert(false)
    } else {
      setShowAlert(true)
    }
  }, [validateStep])
  
  const handlePrevious = useCallback(() => {
    if (step > 1) {
      setStep(prev => prev - 1)
      setShowAlert(false)
    }
  }, [step])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateStep()) {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if(!token){
        router.push("/login")
        return;
      } else {
        try{
          const response = await axios.post("http://localhost:8080/organizations/create", formData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            }
          });
          if (response.status === 201) {
            // marking onboarding as complete
            await axios.post("http://localhost:8080/organizations/complete-onboarding", {}, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            toast({
              title: "Organization Created",
              description: "Your organization has been successfully registered.",
            })
            setTimeout(()=> router.push('/organization/dashboard'),2000);
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to create organization. Please try again.",
            variant: "destructive"
          })
        } finally {
          setIsLoading(false)
        }
      }

    } else {
      setShowAlert(true)
    }
  }, [formData, validateStep, toast, router])

  const steps = useMemo(() => [
    { title: "Personal Information", icon: User },
    { title: "Organization Details", icon: Building },
    { title: "Business Information", icon: Briefcase },
  ], [])

  const renderField = useCallback((name: keyof typeof formData, label: string, icon: React.ElementType, type: string = "text") => (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center text-gray-400 space-x-2">
        {React.createElement(icon, { className: "h-4 w-4 text-gray-400" })}
        <span>{label}</span>
      </Label>
      <Input 
        id={name} 
        name={name} 
        type={type}
        value={formData[name]} 
        onChange={handleInputChange} 
        className={errors[name] ? 'border-red-500' : 'text-white'}
      />
      {errors[name] && <p className="text-red-500 text-xs">{errors[name]}</p>}
    </div>
  ), [formData, handleInputChange, errors])

  const renderCountrySelect = useCallback(() => (
    <div className="space-y-2">
      <Label htmlFor="country" className="flex items-center text-gray-400 space-x-2">
        <Flag className="h-4 w-4 text-gray-400" />
        <span>Country</span>
      </Label>
      <Select onValueChange={(value) => handleSelectChange('country', value)} value={formData.country}>
        <SelectTrigger className={`w-full text-gray-200 ${errors.country ? 'border-red-500' : ''}`}>
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          {africanCountries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex text-gray-500 items-center">
                <ReactCountryFlag
                  countryCode={country.code}
                  svg
                  style={{
                    width: '1.5em',
                    height: '1.5em',
                    marginRight: '0.5em'
                  }}
                />
                {country.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}
    </div>
  ), [formData.country, handleSelectChange, errors.country])

  const renderPhoneField = useCallback(() => {
    const selectedCountry = africanCountries.find(c => c.code === formData.country)
    return (
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="flex items-center text-gray-400 space-x-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>Phone Number</span>
        </Label>
        <div className="flex">
          <div className="flex-shrink-0 z-10 inline-flex items-center py-1.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100">
            {selectedCountry ? (
              <>
                <ReactCountryFlag
                  countryCode={selectedCountry.code}
                  svg
                  style={{
                    width: '1.5em',
                    height: '1.5em',
                    marginRight: '0.5em'
                  }}
                />
                {selectedCountry.dial_code}
              </>
            ) : (
              'Select Country'
            )}
          </div>
          <Input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className={`rounded-l-none text-white ${errors.phoneNumber ? 'border-red-500' : ''}`}
            placeholder="123456789"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
      </div>
    )
  }, [formData.country, formData.phoneNumber, handleInputChange, errors.phoneNumber])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-amber-500">Organization Onboarding</CardTitle>
          <CardDescription className="text-center text-gray-400">Complete your organization profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((s, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex flex-col items-center">
                        <div className={`rounded-full p-2 ${step > index ? 'bg-amber-500' : 'bg-gray-600'}`}>
                          <s.icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="mt-2 text-xs text-gray-400">{s.title}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Step {index + 1}: {s.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            <Progress value={(step / 3) * 100} className="mt-4" />
          </div>
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-4">
                    {renderField("firstName", "First Name", User)}
                    {renderField("lastName", "Last Name", User)}
                    {renderField("jobTitle", "Job Title", Briefcase)}
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-4">
                    {renderField("organizationName", "Organization Name", Building)}
                    {renderField("address", "Address", MapPin)}
                    {renderField("city", "City", MapPin)}
                    {renderCountrySelect()}
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-4">
                    {renderPhoneField()}
                    <div className="space-y-2">
                      <Label htmlFor="businessCategory" className="flex items-center text-gray-400 space-x-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span>Business Category</span>
                      </Label>
                      <Select onValueChange={(value) => handleSelectChange('businessCategory', value)} value={formData.businessCategory}>
                        <SelectTrigger className={`w-full text-white ${errors.businessCategory ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="construction">Construction</SelectItem>
                          <SelectItem value="tourism-hospitality">Tourism</SelectItem>
                          <SelectItem value="nonprofit">Non-profit & NGO</SelectItem>
                          <SelectItem value="government">Government & Public Sector</SelectItem>
                          <SelectItem value="automotive">Automotive</SelectItem>
                          <SelectItem value="aerospace">Aerospace</SelectItem>
                          <SelectItem value="sports-fitness">Sports & Fitness</SelectItem>
                          <SelectItem value="arts-culture">Arts & Culture</SelectItem>
                          <SelectItem value="legal">Legal Services</SelectItem>
                          <SelectItem value="fashion-apparel">Fashion & Apparel</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.businessCategory && <p className="text-red-500 text-xs">{errors.businessCategory}</p>}
                    </div>
                      <RegistrationNumberField 
                      formData={formData}
                      handleInputChange={handleInputChange}
                      errors={errors}
                      />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={step === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {step < 3 ? (
            <Button onClick={handleNext}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Complete'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
      <AnimatePresence>
      <div className="absolute bottom-4 right-4">
        {showAlert && Object.keys(errors).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Please correct the errors before proceeding.
          </AlertDescription>
        </Alert>
        </motion.div>
      )}
      </div>
      </AnimatePresence>

    </div>
  )
}

export default OrganizationOnboarding;

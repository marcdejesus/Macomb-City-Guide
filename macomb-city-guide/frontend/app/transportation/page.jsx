import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Bus, 
  Car, 
  ParkingSquare, 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink,
  Calendar
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import TransportMap from "./TransportMap";
import { getTransportTypes, getTransportOptions } from "@/lib/api";

// This would be replaced with actual API calls in production
async function getTransportData() {
  // In production, you would use the API functions:
  // const transportTypes = await getTransportTypes();
  // const publicTransit = await getTransportOptions({ transport_type: 'Public Transit' });
  // etc.
  
  // For now, mocking the data
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const transportTypes = [
    { id: 1, name: "Public Transit", icon: "Bus" },
    { id: 2, name: "Taxi & Rideshare", icon: "Car" },
    { id: 3, name: "Parking", icon: "ParkingSquare" }
  ];
  
  const publicTransit = [
    {
      id: 1,
      name: "SMART Bus - Macomb County Routes",
      description: "Suburban Mobility Authority for Regional Transportation operates bus services throughout Macomb County with routes connecting to Detroit.",
      image: "https://images.unsplash.com/photo-1612916034358-33e004ab3ea7?q=80&w=800",
      route_numbers: "510, 530, 560, 580",
      website: "https://www.smartbus.org",
      phone: "(866) 962-5515",
      hours: "Monday-Friday: 5am-12am, Weekends: 7am-10pm",
      fare: "$2.00 per ride, $5.00 day pass",
      notes: "Seniors, persons with disabilities, and youth pay reduced fares of $0.50 per ride.",
      locations: [
        { name: "Macomb Mall Transit Center", address: "32233 Gratiot Ave, Roseville, MI" },
        { name: "Lakeside Mall Transit Stop", address: "14000 Lakeside Cir, Sterling Heights, MI" },
        { name: "Macomb Community College Stop", address: "14500 E 12 Mile Rd, Warren, MI" }
      ],
      schedule: [
        { route: "510", direction: "Northbound", times: ["5:00 AM", "6:15 AM", "7:30 AM", "8:45 AM", "10:00 AM", "11:15 AM", "12:30 PM", "1:45 PM", "3:00 PM", "4:15 PM", "5:30 PM", "6:45 PM", "8:00 PM"] },
        { route: "510", direction: "Southbound", times: ["5:45 AM", "7:00 AM", "8:15 AM", "9:30 AM", "10:45 AM", "12:00 PM", "1:15 PM", "2:30 PM", "3:45 PM", "5:00 PM", "6:15 PM", "7:30 PM", "8:45 PM"] },
        { route: "530", direction: "Eastbound", times: ["5:30 AM", "6:45 AM", "8:00 AM", "9:15 AM", "10:30 AM", "11:45 AM", "1:00 PM", "2:15 PM", "3:30 PM", "4:45 PM", "6:00 PM", "7:15 PM", "8:30 PM"] },
        { route: "530", direction: "Westbound", times: ["5:15 AM", "6:30 AM", "7:45 AM", "9:00 AM", "10:15 AM", "11:30 AM", "12:45 PM", "2:00 PM", "3:15 PM", "4:30 PM", "5:45 PM", "7:00 PM", "8:15 PM"] }
      ]
    },
    {
      id: 2,
      name: "Macomb County Transit Connection",
      description: "Local transit service focusing on accessibility for seniors and people with disabilities.",
      image: "https://images.unsplash.com/photo-1538980089464-4d3c50f7e509?q=80&w=800",
      route_numbers: "Community Routes",
      website: "https://www.macombcountymi.gov/transit",
      phone: "(586) 469-5885",
      hours: "Monday-Friday: 6am-6pm",
      fare: "$1.00 per ride for eligible passengers",
      notes: "Advanced reservation required. Serves seniors, persons with disabilities, and veterans.",
      locations: [
        { name: "Macomb County Administration Building", address: "1 S. Main Street, Mount Clemens, MI" },
        { name: "Macomb Community Action Office", address: "21885 Dunham Road, Clinton Township, MI" }
      ]
    }
  ];
  
  const taxiRideshare = [
    {
      id: 1,
      name: "Macomb Taxi Service",
      description: "Local taxi company serving all of Macomb County with 24/7 availability.",
      image: "https://images.unsplash.com/photo-1568438350562-2cae6d394ad0?q=80&w=800",
      service_type: "Taxi",
      website: "https://www.macombtaxi.com",
      phone: "(586) 555-8294",
      hours: "24/7",
      fare: "Base fare $3.00, $2.50 per mile",
      notes: "Advance booking available. Airport service specialization.",
      areas_served: "All Macomb County, Detroit Metro Airport"
    },
    {
      id: 2,
      name: "Uber",
      description: "Rideshare service available throughout Macomb County via mobile app.",
      image: "https://images.unsplash.com/photo-1581262208435-41724892bbb1?q=80&w=800",
      service_type: "Rideshare",
      website: "https://www.uber.com",
      phone: "App Only",
      hours: "24/7 (driver availability varies)",
      fare: "Varies based on distance and demand",
      notes: "Download the Uber app to book rides and view fare estimates.",
      areas_served: "All Macomb County and surrounding areas"
    },
    {
      id: 3,
      name: "Lyft",
      description: "Rideshare platform offering on-demand transportation services.",
      image: "https://images.unsplash.com/photo-1589868033293-c0722aff4fe2?q=80&w=800",
      service_type: "Rideshare",
      website: "https://www.lyft.com",
      phone: "App Only",
      hours: "24/7 (driver availability varies)",
      fare: "Varies based on distance and demand",
      notes: "Download the Lyft app to book rides and view fare estimates.",
      areas_served: "All Macomb County and surrounding areas"
    }
  ];
  
  const parking = [
    {
      id: 1,
      name: "Downtown Mount Clemens Parking Garage",
      description: "Multi-level covered parking garage in the heart of downtown Mount Clemens.",
      image: "https://images.unsplash.com/photo-1545179605-1c19758b333b?q=80&w=800",
      type: "Garage",
      address: "100 N. Main Street, Mount Clemens, MI",
      hours: "24/7",
      rates: "$1.00/hour, $5.00/day maximum",
      spaces: 450,
      features: ["Covered", "Security Cameras", "Well Lit", "Elevator Access"],
      latitude: 42.5971,
      longitude: -82.8789
    },
    {
      id: 2,
      name: "Macomb County Administration Parking",
      description: "Public parking lot adjacent to the Macomb County Administration Building.",
      image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=800",
      type: "Surface Lot",
      address: "10 N. Main Street, Mount Clemens, MI",
      hours: "Monday-Friday: 7am-7pm",
      rates: "First 2 hours free, $2.00/hour after",
      spaces: 200,
      features: ["Handicap Accessible", "Well Lit"],
      latitude: 42.5968,
      longitude: -82.8792
    },
    {
      id: 3,
      name: "Lakeside Mall Parking",
      description: "Extensive parking surrounding the Lakeside Mall shopping center.",
      image: "https://images.unsplash.com/photo-1616363088386-31c4a8414858?q=80&w=800",
      type: "Surface Lot",
      address: "14000 Lakeside Circle, Sterling Heights, MI",
      hours: "Mall Hours: 10am-9pm",
      rates: "Free",
      spaces: 1500,
      features: ["Free Parking", "Well Lit", "Security Patrol"],
      latitude: 42.6219,
      longitude: -82.9898
    }
  ];
  
  return { transportTypes, publicTransit, taxiRideshare, parking };
}

export default async function TransportationPage() {
  const { transportTypes, publicTransit, taxiRideshare, parking } = await getTransportData();
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Macomb Transportation Guide</h1>
        <p className="text-muted-foreground">Getting around Macomb County with ease - buses, taxis, rideshare options and parking facilities</p>
      </div>
      
      <Tabs defaultValue="public-transit" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="public-transit" className="flex items-center gap-2">
            <Bus className="h-4 w-4" />
            Public Transit
          </TabsTrigger>
          <TabsTrigger value="taxi-rideshare" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Taxi & Rideshare
          </TabsTrigger>
          <TabsTrigger value="parking" className="flex items-center gap-2">
            <ParkingSquare className="h-4 w-4" />
            Parking
          </TabsTrigger>
        </TabsList>
        
        {/* PUBLIC TRANSIT TAB */}
        <TabsContent value="public-transit">
          <div className="space-y-8">
            <div className="bg-muted/50 rounded-lg p-6 border">
              <h2 className="text-xl font-semibold mb-4">Public Transportation in Macomb County</h2>
              <p className="text-muted-foreground mb-4">
                Macomb County is served by several public transit options, including SMART bus routes and specialized community transit services. Use the information below to plan your journey.
              </p>
              
              <div className="flex flex-col lg:flex-row gap-4 mt-6">
                <div className="bg-card border rounded-lg p-4 flex-1">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Bus className="h-4 w-4 mr-2 text-primary" />
                    Fares
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>SMART Bus - Single Ride</span>
                      <span className="font-medium">$2.00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>SMART Bus - Day Pass</span>
                      <span className="font-medium">$5.00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>SMART Bus - 31-Day Pass</span>
                      <span className="font-medium">$66.00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Reduced Fare (Senior/Disabled)</span>
                      <span className="font-medium">$0.50</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-card border rounded-lg p-4 flex-1">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-primary" />
                    Transit Contact Information
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex flex-col">
                      <span className="font-medium">SMART Customer Service</span>
                      <a href="tel:866-962-5515" className="text-primary hover:underline">(866) 962-5515</a>
                    </li>
                    <li className="flex flex-col">
                      <span className="font-medium">Macomb County Transit</span>
                      <a href="tel:586-469-5885" className="text-primary hover:underline">(586) 469-5885</a>
                    </li>
                    <li className="flex flex-col">
                      <span className="font-medium">Transit Information</span>
                      <a href="https://www.smartbus.org" className="text-primary hover:underline flex items-center">
                        smartbus.org
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-card border rounded-lg p-4 flex-1">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    Service Information
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex flex-col">
                      <span className="font-medium">Weekday Service</span>
                      <span>5:00 AM - 12:00 AM</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="font-medium">Weekend Service</span>
                      <span>7:00 AM - 10:00 PM</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="font-medium">Holiday Schedule</span>
                      <span>Reduced service on major holidays</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Bus Routes and Schedules */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Bus Routes and Schedules</h2>
              <div className="space-y-6">
                <Suspense fallback={<LoadingSpinner />}>
                  {publicTransit.map((transit) => (
                    <Card key={transit.id} className="overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3 h-48 relative">
                          <Image
                            src={transit.image}
                            alt={transit.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6 md:w-2/3">
                          <CardHeader className="px-0 pt-0">
                            <div className="flex items-center justify-between mb-2">
                              <Badge>{transit.route_numbers}</Badge>
                            </div>
                            <CardTitle>{transit.name}</CardTitle>
                            <CardDescription>{transit.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="px-0 py-2">
                            <div className="space-y-2">
                              <div className="flex items-start">
                                <Clock className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                                <div>
                                  <span className="text-sm font-medium">Hours</span>
                                  <p className="text-sm text-muted-foreground">{transit.hours}</p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <Phone className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                                <div>
                                  <span className="text-sm font-medium">Contact</span>
                                  <p className="text-sm text-muted-foreground">{transit.phone}</p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                                <div>
                                  <span className="text-sm font-medium">Key Stops</span>
                                  <p className="text-sm text-muted-foreground">
                                    {transit.locations.map(loc => loc.name).join(", ")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="px-0 pt-2">
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm">
                                <a href="#transit-schedule" className="flex items-center">
                                  View Schedule
                                </a>
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <a 
                                  href={transit.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  Website
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </Button>
                            </div>
                          </CardFooter>
                        </div>
                      </div>
                    </Card>
                  ))}
                </Suspense>
              </div>
            </div>
            
            {/* Bus Schedule Table */}
            <div id="transit-schedule">
              <h2 className="text-xl font-semibold mb-4">SMART Bus Schedules</h2>
              
              <div className="overflow-x-auto">
                <Tabs defaultValue="510-northbound">
                  <TabsList className="mb-6">
                    <TabsTrigger value="510-northbound">510 Northbound</TabsTrigger>
                    <TabsTrigger value="510-southbound">510 Southbound</TabsTrigger>
                    <TabsTrigger value="530-eastbound">530 Eastbound</TabsTrigger>
                    <TabsTrigger value="530-westbound">530 Westbound</TabsTrigger>
                  </TabsList>
                  
                  {publicTransit[0].schedule.map((schedule) => (
                    <TabsContent 
                      key={`${schedule.route}-${schedule.direction.toLowerCase()}`}
                      value={`${schedule.route}-${schedule.direction.toLowerCase()}`}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Route {schedule.route} - {schedule.direction}</CardTitle>
                          <CardDescription>Weekday service times (Monday-Friday)</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableCaption>All times are approximate and subject to traffic conditions.</TableCaption>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[180px]">Major Stop</TableHead>
                                <TableHead colSpan={5}>Departure Times</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">Macomb Mall Transit Center</TableCell>
                                {schedule.times.slice(0, 5).map((time, i) => (
                                  <TableCell key={i}>{time}</TableCell>
                                ))}
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Lakeside Mall Transit Stop</TableCell>
                                {schedule.times.slice(2, 7).map((time, i) => (
                                  <TableCell key={i}>{time}</TableCell>
                                ))}
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Macomb Community College</TableCell>
                                {schedule.times.slice(4, 9).map((time, i) => (
                                  <TableCell key={i}>{time}</TableCell>
                                ))}
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                        <CardFooter>
                          <p className="text-sm text-muted-foreground">
                            For complete schedules, please visit the <a href="https://www.smartbus.org" className="text-primary hover:underline">SMART website</a> or call customer service at (866) 962-5515.
                          </p>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
            
            {/* Bus Route Map */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Transit Map</h2>
              <div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden border relative">
                <TransportMap 
                  mapType="transitRoutes" 
                  locations={publicTransit.flatMap(t => t.locations.map(loc => ({
                    name: loc.name,
                    address: loc.address,
                    type: 'bus-stop'
                  })))}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* TAXI & RIDESHARE TAB */}
        <TabsContent value="taxi-rideshare">
          <div className="space-y-8">
            <div className="bg-muted/50 rounded-lg p-6 border mb-8">
              <h2 className="text-xl font-semibold mb-4">Taxi & Rideshare Options</h2>
              <p className="text-muted-foreground">
                Macomb County is well-served by traditional taxi services and modern rideshare apps. Compare options to find the best fit for your transportation needs.
              </p>
            </div>
            
            {/* Taxi and Rideshare Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Suspense fallback={<LoadingSpinner />}>
                {taxiRideshare.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <div className="aspect-[16/9] relative">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant={service.service_type === "Taxi" ? "default" : "secondary"}>
                          {service.service_type}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hours:</span>
                          <span>{service.hours}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Base Fare:</span>
                          <span>{service.fare}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span>{service.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Coverage:</span>
                          <span>{service.areas_served}</span>
                        </div>
                      </div>
                      {service.notes && (
                        <div className="mt-4 text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                          <span className="font-medium">Note:</span> {service.notes}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      {service.service_type === "Rideshare" ? (
                        <Button variant="outline" asChild className="w-full">
                          <a 
                            href={service.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Download App
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" asChild className="w-full">
                          <a href={`tel:${service.phone.replace(/[^0-9]/g, '')}`}>
                            Call for Pickup
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </Suspense>
            </div>
            
            {/* Comparison Table */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Service Comparison</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Compare transportation options in Macomb County</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Service</TableHead>
                      <TableHead>Best For</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Booking Method</TableHead>
                      <TableHead>Wait Time</TableHead>
                      <TableHead>Special Features</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Taxi Services</TableCell>
                      <TableCell>Airport trips, scheduled pickups</TableCell>
                      <TableCell>Cash, Credit Card</TableCell>
                      <TableCell>Phone call, street hail</TableCell>
                      <TableCell>5-15 minutes</TableCell>
                      <TableCell>Local knowledge, set rates</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Uber</TableCell>
                      <TableCell>On-demand rides, cashless payment</TableCell>
                      <TableCell>App only (credit card)</TableCell>
                      <TableCell>Mobile app</TableCell>
                      <TableCell>3-10 minutes</TableCell>
                      <TableCell>Upfront pricing, driver rating</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Lyft</TableCell>
                      <TableCell>Quick rides, groups</TableCell>
                      <TableCell>App only (credit card)</TableCell>
                      <TableCell>Mobile app</TableCell>
                      <TableCell>3-10 minutes</TableCell>
                      <TableCell>Scheduled rides, multiple stops</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            
            {/* Map of service areas */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Taxi Service Map</h2>
              <div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden border relative">
                <TransportMap 
                  mapType="taxiServices" 
                  serviceInfo={{
                    name: "Macomb Taxi Service",
                    coverage: "All Macomb County",
                    phone: "(586) 555-8294"
                  }}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* PARKING TAB */}
        <TabsContent value="parking">
          <div className="space-y-8">
            <div className="bg-muted/50 rounded-lg p-6 border mb-8">
              <h2 className="text-xl font-semibold mb-4">Parking in Macomb County</h2>
              <p className="text-muted-foreground">
                Find convenient parking options throughout Macomb County. The map below shows public parking garages, lots, and street parking areas.
              </p>
            </div>
            
            {/* Search and Filter */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Find Parking Near You</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Enter address or landmark"
                      className="pl-8"
                    />
                  </div>
                </div>
                <Button>Find Parking</Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">Free Parking</Badge>
                <Badge variant="outline">Covered Parking</Badge>
                <Badge variant="outline">Handicap Accessible</Badge>
                <Badge variant="outline">24/7 Access</Badge>
              </div>
            </div>
            
            {/* Parking Facilities */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Parking Facilities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Suspense fallback={<LoadingSpinner />}>
                  {parking.map((facility) => (
                    <Card key={facility.id} className="overflow-hidden">
                      <div className="aspect-[16/9] relative">
                        <Image
                          src={facility.image}
                          alt={facility.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary">
                            {facility.type}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle>{facility.name}</CardTitle>
                        <CardDescription>{facility.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Hours:</span>
                            <span>{facility.hours}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rates:</span>
                            <span>{facility.rates}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Capacity:</span>
                            <span>{facility.spaces} spaces</span>
                          </div>
                          <div className="flex items-center mt-3">
                            <MapPin className="h-4 w-4 mr-1.5 text-primary" />
                            <span className="text-sm">{facility.address}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="w-full">
                          <h4 className="text-sm font-medium mb-2">Features:</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {facility.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </Suspense>
              </div>
            </div>
            
            {/* Parking Map */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Parking Map</h2>
              <div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden border relative">
                <TransportMap 
                  mapType="parkingLocations" 
                  locations={parking.map(p => ({
                    name: p.name,
                    address: p.address,
                    type: p.type,
                    spaces: p.spaces,
                    rates: p.rates,
                    latitude: p.latitude,
                    longitude: p.longitude
                  }))}
                />
              </div>
            </div>
            
            {/* Parking Tips */}
            <div className="bg-muted/50 rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-3">Parking Tips</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-0.5 mr-2">1</div>
                  <p>Downtown Mount Clemens has metered street parking with a 2-hour limit on weekdays.</p>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-0.5 mr-2">2</div>
                  <p>Most mall parking is free but has time restrictions during business hours.</p>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-0.5 mr-2">3</div>
                  <p>County buildings offer validated parking for visitors conducting official business.</p>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-0.5 mr-2">4</div>
                  <p>Special event parking may have different rates and availability. Check event information.</p>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
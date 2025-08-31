import { useState, useEffect } from "react";
import { MapPin, Clock, Sparkles, Navigation, Search, Calendar, Users, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import MapLibreMap from "@/components/MapLibreMap";
import { Place, PlacesApi } from "@shared/api";

export default function Index() {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [travelers, setTravelers] = useState("");
  const [previewPlaces, setPreviewPlaces] = useState<Place[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

  // Fetch places when destination changes (with debounce)
  useEffect(() => {
    if (!destination || destination.length < 3) {
      setPreviewPlaces([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoadingPlaces(true);
      try {
        const places = await PlacesApi.getTrendingPlaces(destination, 6);
        setPreviewPlaces(places);
      } catch (error) {
        console.error('Error fetching places:', error);
        setPreviewPlaces([]);
      } finally {
        setIsLoadingPlaces(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [destination]);

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Planning",
      description: "Natural language processing understands your travel style and preferences"
    },
    {
      icon: MapPin,
      title: "Context-Aware Suggestions",
      description: "Foursquare Places API provides real-time, location-based recommendations"
    },
    {
      icon: Clock,
      title: "Time-Efficient Routes",
      description: "Smart algorithms optimize your itinerary for maximum experience"
    },
    {
      icon: Navigation,
      title: "Interactive Maps",
      description: "Mapbox integration with visual route planning and navigation"
    }
  ];

  const sampleItineraries = [
    {
      destination: "Tokyo, Japan",
      duration: "3 days",
      highlights: ["Shibuya Crossing", "Senso-ji Temple", "Tsukiji Market"],
      rating: 4.9,
      travelers: 2
    },
    {
      destination: "Paris, France", 
      duration: "4 days",
      highlights: ["Eiffel Tower", "Louvre Museum", "Montmartre"],
      rating: 4.8,
      travelers: 1
    },
    {
      destination: "New York City",
      duration: "5 days", 
      highlights: ["Central Park", "Times Square", "Brooklyn Bridge"],
      rating: 4.7,
      travelers: 4
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-travel-50 to-accent/10">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">MinutePlanner</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link to="/examples" className="text-muted-foreground hover:text-foreground transition-colors">Examples</Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Button variant="outline" size="sm">Sign In</Button>
            <Link to="/plan">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Plan Your Perfect Trip in{" "}
            <span className="text-primary">Minutes</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Context-aware itinerary planning that understands your travel style. 
            Get personalized recommendations and smart routes powered by AI.
          </p>
          
          {/* Planning Form */}
          <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-left">Start Planning Your Adventure</CardTitle>
              <CardDescription className="text-left">Tell us about your trip and we'll create the perfect itinerary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-left block">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Where to?"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-left block">Duration</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="How long?"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-left block">Travelers</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="How many?"
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <Link to="/plan" className="w-full">
                <Button className="w-full" size="lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create My Itinerary
                </Button>
              </Link>

              {/* Quick Map Preview */}
              <div className="mt-4 p-4 bg-gradient-to-br from-travel-50 to-travel-100 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Live Map Preview</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {isLoadingPlaces ? "Loading..." : "Interactive"}
                  </Badge>
                </div>
                <div className="relative h-48 bg-white rounded-md overflow-hidden">
                  {destination && destination.length >= 3 ? (
                    <MapLibreMap
                      places={previewPlaces}
                      zoom={11}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-travel-100 to-emerald-100">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Enter a destination to see places</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 text-xs text-muted-foreground bg-white/80 px-1 rounded text-[10px]">
                    {previewPlaces.length > 0 ? `${previewPlaces.length} places` : "Real-time"}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {previewPlaces.length > 0
                    ? `Showing ${previewPlaces.length} trending places in ${destination}`
                    : "See your route visualized as you plan"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Visualize Your Journey
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                See your entire trip laid out on our interactive map. Discover nearby attractions,
                restaurants, and hidden gems as you plan your perfect itinerary.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Smart Route Optimization</h3>
                    <p className="text-muted-foreground">Our AI automatically arranges your destinations in the most efficient order, saving you time and energy.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Search className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Real-time Discovery</h3>
                    <p className="text-muted-foreground">Explore points of interest around your planned stops and adjust your itinerary on the fly.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-travel-200/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Navigation className="w-4 h-4 text-travel-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Turn-by-turn Navigation</h3>
                    <p className="text-muted-foreground">Get detailed directions between each stop with estimated travel times and transportation options.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="overflow-hidden shadow-2xl border-0">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3]">
                    <MapLibreMap
                      places={sampleItineraries.length > 0 ? [
                        {
                          id: "demo-1",
                          name: "Senso-ji Temple",
                          category: "Cultural Site",
                          rating: 4.6,
                          duration: "1-2 hours",
                          description: "Ancient Buddhist temple in Asakusa district",
                          distance: "2.1 km",
                          price: "Free",
                          latitude: 35.7148,
                          longitude: 139.7967
                        },
                        {
                          id: "demo-2",
                          name: "Tsukiji Market",
                          category: "Food & Dining",
                          rating: 4.7,
                          duration: "2-3 hours",
                          description: "Fresh seafood and street food market",
                          distance: "3.2 km",
                          price: "¥2,000-4,000",
                          latitude: 35.6654,
                          longitude: 139.7707
                        },
                        {
                          id: "demo-3",
                          name: "Tokyo Skytree",
                          category: "Observation",
                          rating: 4.3,
                          duration: "2 hours",
                          description: "Tallest tower in Japan with panoramic views",
                          distance: "4.1 km",
                          price: "¥2,100-3,400",
                          latitude: 35.7101,
                          longitude: 139.8107
                        }
                      ] : []}
                      center={[139.6917, 35.6895]}
                      zoom={12}
                      className="w-full h-full"
                    />

                    {/* Interactive overlay message */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black/20 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                        Interactive map powered by MapLibre
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating info cards */}
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden xl:block">
                <Card className="w-64 shadow-lg bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Optimal Route Time</p>
                        <p className="text-lg font-bold text-primary">2h 45m</p>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      37% faster than standard routing
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="absolute -left-4 bottom-1/4 hidden xl:block">
                <Card className="w-56 shadow-lg bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Nearby Discovery</p>
                        <p className="text-lg font-bold text-accent">12 places</p>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      Hidden gems within 500m
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Intelligent Travel Planning
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powered by advanced AI and real-time data to create personalized experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-md bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Itineraries */}
      <section id="examples" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Inspiration from Real Travelers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how MinutePlanner creates amazing itineraries for different destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleItineraries.map((itinerary, index) => (
              <Card key={index} className="overflow-hidden shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{itinerary.destination}</CardTitle>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{itinerary.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{itinerary.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{itinerary.travelers} travelers</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Top Highlights:</p>
                    <div className="flex flex-wrap gap-2">
                      {itinerary.highlights.map((highlight, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Full Itinerary
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust MinutePlanner for their perfect trips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/plan">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/examples">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                View Examples
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MinutePlanner</span>
              </div>
              <p className="text-muted-foreground">
                Context-aware travel planning powered by AI
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/api" className="hover:text-foreground transition-colors">API</Link></li>
                <li><Link to="/mobile" className="hover:text-foreground transition-colors">Mobile App</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 MinutePlanner. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

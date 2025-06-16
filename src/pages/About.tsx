
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Globe, Shield, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Uniride
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connecting Nigerian students through safe, affordable, and reliable campus transportation solutions.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">
                  To revolutionize campus transportation in Nigeria by providing students with safe, 
                  affordable, and convenient ride-sharing solutions that connect universities to cities 
                  and communities across the country.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">
                  To become Nigeria's leading campus transportation platform, fostering a community 
                  where every student has access to reliable, safe, and affordable transportation 
                  options for their academic journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Born from the real challenges faced by Nigerian students
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="bg-gray-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">The Challenge</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Nigerian students have long struggled with unreliable and unsafe transportation options 
                  between their universities and home cities. High costs, safety concerns, and lack of 
                  convenient booking systems made travel a constant source of stress and financial burden.
                </p>
              </div>

              <div className="bg-blue-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">The Solution</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Uniride was created to address these exact problems. By connecting verified drivers 
                  with students traveling similar routes, we've created a community-driven platform 
                  that prioritizes safety, affordability, and convenience. Our technology brings 
                  transparency and trust to campus transportation.
                </p>
              </div>

              <div className="bg-green-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">The Impact</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Since our launch, we've facilitated thousands of safe trips, saved students millions 
                  in transportation costs, and built a thriving community of students and drivers across 
                  Nigeria. We're not just a ride-sharing platform – we're a student support network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle>Safety First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Every driver is verified, every route is monitored, and every trip is tracked. 
                  Student safety is our highest priority.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle>Student-Centric</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We understand student needs because we've been there. Affordable pricing, 
                  flexible schedules, and student-friendly policies.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Community Building</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  More than transportation, we're building connections. Students helping students, 
                  creating lasting relationships and networks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership</h2>
            <p className="text-xl text-gray-600">Meet the visionary behind Uniride</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl font-bold text-white">AD</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">Adebayo Dotun</h3>
                  <Badge className="mb-4">Founder & CEO</Badge>
                  
                  <div className="space-y-4 text-gray-600">
                    <p>
                      Adebayo is a visionary entrepreneur and technology enthusiast with a passion 
                      for solving real-world problems through innovative digital solutions. As a 
                      former university student who experienced firsthand the challenges of campus 
                      transportation in Nigeria, he founded Uniride with a mission to transform 
                      how students travel.
                    </p>
                    
                    <p>
                      With a background in technology and a deep understanding of the Nigerian 
                      educational landscape, Adebayo brings together technical expertise and 
                      student advocacy to drive Uniride's growth and impact across the country.
                    </p>
                    
                    <p>
                      Under his leadership, Uniride has grown from a simple idea to a trusted 
                      platform serving thousands of students across multiple universities, 
                      always maintaining the core values of safety, affordability, and 
                      community building.
                    </p>
                  </div>

                  <div className="mt-6 flex justify-center gap-4">
                    <Badge variant="secondary">Technology Innovation</Badge>
                    <Badge variant="secondary">Student Advocacy</Badge>
                    <Badge variant="secondary">Community Building</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-gray-300">The difference we're making in the Nigerian student community</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
              <div className="text-gray-300">Students Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-gray-300">Universities Connected</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">25,000+</div>
              <div className="text-gray-300">Safe Trips Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">99%</div>
              <div className="text-gray-300">Student Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Whether you're a student looking for reliable transportation, a driver wanting to help 
            fellow students, or a partner interested in supporting student mobility, there's a place 
            for you in the Uniride community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">For Students</h3>
                <p className="text-gray-600 mb-4">Join thousands of students already using Uniride</p>
                <Badge className="bg-blue-600">Sign Up Today</Badge>
              </CardContent>
            </Card>

            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="text-center">
                <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">For Drivers</h3>
                <p className="text-gray-600 mb-4">Earn income while helping fellow students</p>
                <Badge className="bg-green-600">Start Driving</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500">© 2025 Uniride. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;

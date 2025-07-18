import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, Target, Eye, Award, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import ceoImgWebp from "@/assets/images/optimized/ceo.webp";
import ceoImgJpg from "@/assets/images/optimized/ceo.jpg";
import aboutImgWebp from "@/assets/images/optimized/dwayne-joe-wmz15JdTJcQ-unsplash.webp";
import aboutImgJpg from "@/assets/images/optimized/dwayne-joe-wmz15JdTJcQ-unsplash.jpg";
import HeaderImgWebp from "@/assets/images/optimized/about_header.webp";
import HeaderImgJpg from "@/assets/images/optimized/about_header.jpg";
import Footer from "@/components/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";

const About = () => {
  const [showCEOLetter, setShowCEOLetter] = useState(false);
  const [showDirectorLetter, setShowDirectorLetter] = useState(false);

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>About Uniride | Nigeria's Student Ride-Sharing Platform</title>
          <meta
            name="description"
            content="Learn about Uniride, our mission, and how we connect students with safe, affordable rides across Nigerian universities."
          />
          <meta property="og:title" content="About Uniride" />
          <meta
            property="og:description"
            content="Learn about Uniride, our mission, and how we connect students with safe, affordable rides across Nigerian universities."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://uniride.ng/about" />
          <meta property="og:image" content="/og-cover.png" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Who owns Uniride?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Uniride is owned and operated by Ambrose Othniel, the Founder & Executive Director, along with a dedicated team passionate about student mobility and safety.",
                  },
                },
                {
                  "@type": "Question",
                  name: "When was Uniride founded?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Uniride was founded in 2023 to solve the transportation challenges faced by Nigerian university students.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is Uniride’s mission?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our mission is to revolutionize student transportation in Nigeria by providing a safe, affordable, and efficient ride-sharing platform connecting universities with major cities.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Where does Uniride operate?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Uniride currently operates in select private universities across Nigeria, with plans to expand to more campuses nationwide.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How can I contact Uniride?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "You can reach us at support@uniride.ng or through our Help page for support and inquiries.",
                  },
                },
              ],
            })}
          </script>
        </Helmet>

        <Navbar />

        {/* Hero Section */}
        <section
          className="relative bg-black text-white py-20"
          style={{
            backgroundImage: `url(${HeaderImgWebp})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/80"></div>
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Uniride
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Uniride is a product of Ride Africa Transport Enterprises, built
              to solve a real need across Nigerian campuses — safe, simple, and
              student-focused travel. We’re more than a platform; we’re shaping
              movement culture for students, backed by a legally registered
              vision with bold ambitions.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Our Mission
                </h2>
                <div className="flex items-start gap-4 mb-6">
                  <Target className="h-8 w-8 text-black mt-1" />
                  <p className="text-lg text-gray-600">
                    To revolutionize student transportation in Nigeria by
                    providing a safe, affordable, and efficient ride-sharing
                    platform that connects universities with major cities,
                    making travel accessible for every student.
                  </p>
                </div>

                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <div className="flex items-start gap-4">
                  <Eye className="h-8 w-8 text-black mt-1" />
                  <p className="text-lg text-gray-600">
                    To become the leading student transportation network across
                    Africa, fostering academic mobility and creating
                    opportunities for students to pursue their dreams without
                    transportation barriers.
                  </p>
                </div>
              </div>
              <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center overflow-hidden">
                <picture>
                  <source srcSet={aboutImgWebp} type="image/webp" />
                  <img
                    src={aboutImgJpg}
                    alt="Mission"
                    className="object-cover w-full h-full"
                  />
                </picture>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Leadership
              </h2>
              <p className="text-xl text-gray-600">
                Meet the team driving Uniride's mission
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* CEO Card */}
              <Card
                className="relative text-center hover:shadow-lg transition-shadow overflow-hidden min-h-[280px] flex items-end justify-center group"
                style={{
                  backgroundImage: `url(${ceoImgWebp})`,
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                }}
              >
                {/* Overlay for extra depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90 z-0 group-hover:from-black/60 transition-all duration-300" />
                {/* Content - Name, position, and button at the bottom, with top padding to mimic avatar space */}
                <div className="relative z-10 flex flex-col items-center justify-end w-full h-full pb-7 pt-20 px-6">
                  <CardTitle className="text-2xl text-white mb-1 drop-shadow-lg font-bold tracking-wide">
                    Ambrose Othniel
                  </CardTitle>
                  <p className="text-gray-200 mb-4 font-medium">
                    Founder & Executive Director
                  </p>
                  <Button
                    onClick={() => setShowCEOLetter(true)}
                    className="bg-white text-black hover:bg-gray-200 font-semibold shadow-md px-8 py-3 rounded-full transition-all duration-200"
                  >
                    Read Othniel's Letter
                  </Button>
                </div>
              </Card>

              {/* Director Card */}
              <Card
                className="relative text-center hover:shadow-lg transition-shadow overflow-hidden min-h-[280px] flex items-end justify-center group"
                style={{
                  backgroundImage: `url(${aboutImgWebp})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay for extra depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90 z-0 group-hover:from-black/60 transition-all duration-300" />
                {/* Content - Name, position, and button at the bottom, with top padding to mimic avatar space */}
                <div className="relative z-10 flex flex-col items-center justify-end w-full h-full pb-7 pt-20 px-6">
                  <CardTitle className="text-2xl text-white mb-1 drop-shadow-lg font-bold tracking-wide">
                    Ajala Ademide
                  </CardTitle>
                  <p className="text-gray-200 mb-4 font-medium">
                    Brand Symbol Designer
                  </p>
                  <Button
                    onClick={() => setShowDirectorLetter(true)}
                    className="bg-white text-black hover:bg-gray-200 font-semibold shadow-md px-8 py-3 rounded-full transition-all duration-200"
                  >
                    Read Mide's Letter
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Our Story
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Born from the real challenges faced by Nigerian students
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="bg-gray-50 p-8 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4">The Challenge</h3>
                  <p className="text-gray-600 text-lg mb-6">
                    Nigerian students have long struggled with unreliable and
                    unsafe transportation options between their universities and
                    home cities. High costs, safety concerns, and lack of
                    convenient booking systems made travel a constant source of
                    stress and financial burden.
                  </p>
                </div>

                <div className="bg-blue-50 p-8 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4">The Solution</h3>
                  <p className="text-gray-600 text-lg mb-6">
                    Uniride was created to address these exact problems. By
                    connecting verified drivers with students traveling similar
                    routes, we've created a community-driven platform that
                    prioritizes safety, affordability, and convenience. Our
                    technology brings transparency and trust to campus
                    transportation.
                  </p>
                </div>

                <div className="bg-green-50 p-8 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4">The Impact</h3>
                  <p className="text-gray-600 text-lg mb-6">
                    We're just getting started, but the momentum is real.
                    Students are already booking safer, more affordable trips
                    with Uniride, and our growing community of trusted drivers
                    is changing the way campus travel works. Our mission is
                    clear: to support students with reliable mobility and build
                    a ride-sharing network made for campus life in Nigeria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 bg-black rounded-full flex items-center justify-center">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>Safety First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Every driver is thoroughly vetted and all vehicles are
                    inspected to ensure the highest safety standards for our
                    students.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 bg-black rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>Student-Centric</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our platform is designed with students in mind, offering
                    affordable pricing and flexible scheduling options.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 bg-black rounded-full flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>Reliability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We're committed to providing dependable transportation
                    services that students can count on for their academic
                    journey.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CEO Letter Modal */}
        <Dialog open={showCEOLetter} onOpenChange={setShowCEOLetter}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Letter from the Founder
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Ambrose Othniel</h3>
                  <p className="text-gray-600">Founder & Executive Director</p>
                </div>
              </div>

              <div className="prose max-w-none">
                <Quote className="h-8 w-8 text-gray-400 mb-4" />
                <p className="text-lg leading-relaxed mb-4">
                  Dear Students and Partners,
                </p>
                <p className="mb-4">
                  If there’s one thing we humans never seem to run out of — it’s
                  problems. But every problem hides a seed of opportunity.
                </p>
                <p className="mb-4">
                  After my Undergraduate studies in 2023, I looked back and saw
                  something that had been hiding in plain sight: the scattered,
                  stressful way students in Nigeria travel to and from their
                  universities. Whether during resumption or holidays, students
                  still rely on motor parks, group chats, and word of mouth to
                  secure rides — with little structure or certainty.
                </p>
                <p className="mb-4">
                  I knew it could be done better. That’s why I founded Uniride —
                  a smarter, safer, and more seamless way for students to book
                  pre-arranged rides. What began as a response to a common
                  frustration has grown into something bigger.
                </p>
                <p className="mb-4">
                  {" "}
                  Today, Uniride isn’t just solving a transport problem. We’re
                  replacing chaos with clarity — making student travel feel like
                  it should: convenient, secure, and stress-free.
                </p>
                <p className="mb-4">
                  We’re building for a future where one question students and
                  parents ask before applying to a university is:{" "}
                  <span className="italic">“Is Uniride available there?”</span>{" "}
                  By the end of 2026, we aim to have served over 25,000 students
                  across Nigeria, with Uniride present in every major
                  university. We’re not just creating a service — we’re setting
                  a new standard.
                </p>
                <p className="mb-4">
                  As both a software engineer and the Executive Director of
                  Uniride, I’m leading this vision from the front — not just
                  with ideas, but with action. And at the heart of it all is a
                  simple hope: <br />
                  To serve.
                  <br />
                  Truly, and well.
                </p>
                <p className="font-semibold">
                  — Othniel Ambrose
                  <br />
                  Founder & Executive Director
                  <br />
                  Uniride
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Director Letter Modal */}
        <Dialog open={showDirectorLetter} onOpenChange={setShowDirectorLetter}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                A Word from the Brand Symbol Designer
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Ademide Ajala</h3>
                  <p className="text-gray-600">Brand Symbol Designer</p>
                </div>
              </div>

              <div className="prose max-w-none">
                <Quote className="h-8 w-8 text-gray-400 mb-4" />
                <p className="text-lg leading-relaxed mb-4">
                  Uniride isn’t just a ride platform — it’s a movement reshaping
                  how students travel, connect, and feel seen. I had the chance
                  to contribute to its early identity, crafting a brand symbol
                  and favicon that capture simplicity, purpose, and clarity. As
                  the full logo comes to life, I’m excited to help shape how
                  Uniride is recognized and remembered. This project reflects
                  what good design should do — quietly empower a bold vision.
                </p>
                <p className="font-semibold">
                  — Ademide Ajala
                  <br />
                  Brand Symbol Designer
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 md:px-0 text-justify">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8 flex flex-col items-center">
              <div className="lg:max-w-2xl max-w-xl w-full">
                <h3 className="font-semibold text-lg mb-2">
                  Who owns Uniride?
                </h3>
                <p className="text-gray-700">
                  Uniride is owned by its founder, Ambrose Othniel — an
                  entrepreneurial developer who created the platform to simplify
                  university travel for students across Nigeria. It is operated
                  by the Uniride team to ensure rides are safe and easy to book.
                </p>
              </div>
              <div className="lg:max-w-2xl max-w-xl w-full">
                <h3 className="font-semibold text-lg mb-2">
                  When was Uniride founded?
                </h3>
                <p className="text-gray-700">
                  Uniride was founded in 2023 to solve the transportation
                  challenges faced by Nigerian university students.
                </p>
              </div>
              <div className="lg:max-w-2xl max-w-xl w-full">
                <h3 className="font-semibold text-lg mb-2">
                  What is Uniride’s mission?
                </h3>
                <p className="text-gray-700">
                  Our mission is to revolutionize student transportation in
                  Nigeria by providing a safe, affordable, and efficient
                  ride-sharing platform connecting universities with major
                  cities.
                </p>
              </div>
              <div className="lg:max-w-2xl max-w-xl w-full">
                <h3 className="font-semibold text-lg mb-2">
                  Where does Uniride operate?
                </h3>
                <p className="text-gray-700">
                  Uniride currently operates in select private universities
                  across Nigeria, with plans to expand to more campuses
                  nationwide.
                </p>
              </div>
              <div className="lg:max-w-2xl max-w-xl w-full">
                <h3 className="font-semibold text-lg mb-2">
                  How can I contact Uniride?
                </h3>
                <p className="text-gray-700">
                  You can reach us at{" "}
                  <a
                    href="mailto:support@uniride.ng"
                    className="text-black underline"
                  >
                    support@uniride.ng
                  </a>{" "}
                  or through our Help page for support and inquiries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-white text-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to join the Uniride community?
            </h2>
            <p className="text-xl text-gray-800 mb-10">
              Sign up now and experience safe, affordable, and convenient campus
              travel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg md:text-xl rounded-full shadow w-full sm:w-auto min-w-[180px] flex-1"
                >
                  Sign up
                </Button>
              </Link>
              <Link to="/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-black hover:bg-gray-100 hover:text-black px-8 py-4 text-lg md:text-xl rounded-full shadow w-full sm:w-auto min-w-[180px] flex-1"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer placeholder */}
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default About;

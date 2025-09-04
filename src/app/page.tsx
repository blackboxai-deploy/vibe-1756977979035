"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      title: "Résumés Intelligents",
      description: "Générez des résumés automatiques de vos cours avec l'IA",
      icon: "📝",
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Examens Adaptatifs",
      description: "Créez des examens personnalisés selon votre niveau",
      icon: "📋",
      color: "bg-green-50 border-green-200"
    },
    {
      title: "Suivi des Progrès",
      description: "Analysez vos performances et suivez votre évolution",
      icon: "📊",
      color: "bg-purple-50 border-purple-200"
    },
    {
      title: "Matières Variées",
      description: "Mathématiques, sciences, histoire, français et plus",
      icon: "🎯",
      color: "bg-amber-50 border-amber-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EcoLearn
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/subjects" className="text-gray-600 hover:text-blue-600 transition-colors">
              Matières
            </Link>
            <Link href="/summaries" className="text-gray-600 hover:text-blue-600 transition-colors">
              Résumés
            </Link>
            <Link href="/exams" className="text-gray-600 hover:text-blue-600 transition-colors">
              Examens
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            🚀 Nouvelle plateforme éducative IA
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
            Apprenez plus intelligemment avec l'IA
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            EcoLearn révolutionne l'apprentissage scolaire avec des résumés automatiques, 
            des examens adaptatifs et un suivi personnalisé de vos progrès.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg">
                Commencer maintenant
              </Button>
            </Link>
            <Link href="/subjects">
              <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-500 px-8 py-3 text-lg">
                Découvrir les matières
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Fonctionnalités innovantes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez comment l'intelligence artificielle peut transformer votre façon d'étudier
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className={`${feature.color} hover:scale-105 transition-transform duration-300`}>
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-2">{feature.icon}</div>
                <CardTitle className="text-lg text-gray-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à révolutionner votre apprentissage ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'étudiants qui utilisent déjà EcoLearn pour améliorer leurs résultats scolaires.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Commencer gratuitement
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-2xl font-bold">EcoLearn</span>
            </div>
            <p className="text-gray-400 text-center md:text-right">
              © 2024 EcoLearn. Une approche intelligente de l'éducation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
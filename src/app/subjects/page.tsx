"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { subjects } from "@/data/subjects";

export default function SubjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EcoLearn
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/summaries" className="text-gray-600 hover:text-blue-600 transition-colors">
                Résumés
              </Link>
              <Link href="/exams" className="text-gray-600 hover:text-blue-600 transition-colors">
                Examens
              </Link>
              <Link href="/history" className="text-gray-600 hover:text-blue-600 transition-colors">
                Historique
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Matières Scolaires
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explorez nos matières et commencez à créer des résumés et des examens personnalisés
          </p>
        </div>

        {/* Level Selection */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white rounded-lg p-1 border">
            <Button variant="default" className="bg-blue-500 text-white">
              Collège
            </Button>
            <Button variant="ghost" className="text-gray-600">
              Primaire
            </Button>
            <Button variant="ghost" className="text-gray-600">
              Lycée
            </Button>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${subject.color} rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {subject.icon}
                </div>
                <CardTitle className="text-xl text-gray-800">
                  {subject.name}
                </CardTitle>
                <Badge variant="secondary" className="w-fit mx-auto">
                  {subject.level}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 mb-6">
                  {subject.description}
                </CardDescription>
                
                <div className="space-y-2">
                  <Link href={`/summaries?subject=${subject.id}`}>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                      📝 Créer un résumé
                    </Button>
                  </Link>
                  <Link href={`/exams?subject=${subject.id}`}>
                    <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                      📋 Passer un examen
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Apprentissage personnalisé avec l'IA
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Chaque matière propose des résumés automatiques et des examens adaptatifs 
              générés par intelligence artificielle selon votre niveau et vos besoins.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold mb-1">Contenu adaptatif</h3>
                <p className="text-sm opacity-80">Questions et résumés personnalisés</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold mb-1">Génération rapide</h3>
                <p className="text-sm opacity-80">Résultats en quelques secondes</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-semibold mb-1">Suivi des progrès</h3>
                <p className="text-sm opacity-80">Analysez votre évolution</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Subjects */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Matières les plus populaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjects.slice(0, 3).map((subject) => (
              <Card key={subject.id} className="border-2 border-amber-200 bg-amber-50">
                <CardHeader className="text-center">
                  <div className="text-3xl mb-2">{subject.icon}</div>
                  <CardTitle className="text-gray-800">{subject.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <Badge className="bg-amber-500 text-white">⭐ Populaire</Badge>
                    <p className="text-sm text-gray-600">{subject.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
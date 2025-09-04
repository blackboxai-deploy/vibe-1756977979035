"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { subjects } from "@/data/subjects";

interface GeneratedSummary {
  id: string;
  title: string;
  content: string;
  subject: string;
  level: string;
  wordCount: number;
  createdAt: Date;
}

export default function SummariesPage() {
  const [originalText, setOriginalText] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("moyen");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<GeneratedSummary | null>(null);
  const [progress, setProgress] = useState(0);

  const generateSummary = async () => {
    if (!originalText.trim() || !selectedSubject) {
      alert("Veuillez saisir du texte et sélectionner une matière");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    
    try {
      // Simulation du progrès
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: originalText,
          subject: selectedSubject,
          level: selectedLevel
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du résumé');
      }

      const data = await response.json();
      clearInterval(progressInterval);
      setProgress(100);

      const summary: GeneratedSummary = {
        id: Date.now().toString(),
        title: `Résumé ${subjects.find(s => s.id === selectedSubject)?.name}`,
        content: data.summary,
        subject: selectedSubject,
        level: selectedLevel,
        wordCount: data.summary.split(' ').length,
        createdAt: new Date()
      };

      setGeneratedSummary(summary);
      
      // Sauvegarder dans le localStorage
      const existingSummaries = JSON.parse(localStorage.getItem('summaries') || '[]');
      existingSummaries.push(summary);
      localStorage.setItem('summaries', JSON.stringify(existingSummaries));

    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération du résumé. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const downloadSummary = () => {
    if (!generatedSummary) return;
    
    const element = document.createElement('a');
    const file = new Blob([generatedSummary.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `resume-${generatedSummary.subject}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

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
              <Link href="/subjects" className="text-gray-600 hover:text-blue-600 transition-colors">
                Matières
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Générateur de Résumés IA
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transformez vos cours en résumés clairs et structurés grâce à l'intelligence artificielle
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📝</span>
                <span>Créer un nouveau résumé</span>
              </CardTitle>
              <CardDescription>
                Collez votre contenu de cours et laissez l'IA créer un résumé personnalisé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subject Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Matière</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.icon} {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Level Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Niveau de détail</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="court">Court (100-200 mots)</SelectItem>
                    <SelectItem value="moyen">Moyen (300-500 mots)</SelectItem>
                    <SelectItem value="detaille">Détaillé (600+ mots)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Text Input */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Contenu du cours ({originalText.length} caractères)
                </label>
                <Textarea
                  placeholder="Collez ici le contenu de votre cours, vos notes ou tout texte à résumer..."
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  className="min-h-[300px]"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateSummary}
                disabled={!originalText.trim() || !selectedSubject || isGenerating}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                {isGenerating ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Génération en cours...</span>
                  </span>
                ) : (
                  "🚀 Générer le résumé"
                )}
              </Button>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-gray-600 text-center">
                    L'IA analyse votre contenu... {progress}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>✨</span>
                <span>Résumé généré</span>
              </CardTitle>
              <CardDescription>
                Votre résumé personnalisé apparaîtra ici
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedSummary ? (
                <div className="space-y-4">
                  {/* Summary Header */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge className="bg-blue-500">
                      {subjects.find(s => s.id === generatedSummary.subject)?.name}
                    </Badge>
                    <Badge variant="outline">
                      {generatedSummary.level}
                    </Badge>
                    <Badge variant="outline">
                      {generatedSummary.wordCount} mots
                    </Badge>
                  </div>

                  {/* Summary Content */}
                  <div className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                      {generatedSummary.content}
                    </pre>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button onClick={downloadSummary} variant="outline" className="flex-1">
                      📥 Télécharger
                    </Button>
                    <Button 
                      onClick={() => {
                        setOriginalText("");
                        setGeneratedSummary(null);
                      }}
                      variant="outline" 
                      className="flex-1"
                    >
                      🔄 Nouveau résumé
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📄</div>
                  <p>Votre résumé généré apparaîtra ici</p>
                  <p className="text-sm mt-2">Saisissez du contenu et cliquez sur "Générer"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle>💡 Conseils pour de meilleurs résumés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2">📚 Contenu structuré</h3>
                <p className="text-sm text-gray-600">
                  Utilisez des textes avec des titres et des paragraphes clairs pour de meilleurs résultats
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">🎯 Soyez spécifique</h3>
                <p className="text-sm text-gray-600">
                  Choisissez la bonne matière pour que l'IA adapte le vocabulaire et le style
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">⚖️ Longueur optimale</h3>
                <p className="text-sm text-gray-600">
                  Pour des textes longs, choisissez "Détaillé" pour ne rien manquer d'important
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
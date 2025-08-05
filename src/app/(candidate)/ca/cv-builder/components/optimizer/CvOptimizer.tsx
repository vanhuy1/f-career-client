'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import {
  optimizeCvById,
  useCvOptimizationSuggestions,
  useCvOptimizationLoadingState,
  useCvOptimizationErrors,
  clearOptimizationSuggestions,
  useCvDetailById,
  useCvOptimizationHistory,
  restoreFromHistory,
} from '@/services/state/cvSlice';
import { LoadingState } from '@/store/store.model';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Sparkles,
  Loader2,
  History,
  Clock,
  FileText,
  GraduationCap,
  Briefcase,
  Target,
  CheckCircle,
  AlertCircle,
  Zap,
} from 'lucide-react';
import type { Cv, Experience, Education } from '@/types/Cv';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import OptimizationHistory from './OptimizationHistory';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CvOptimizerProps {
  cvId: string;
  onUpdateCv:
    | ((updatedCv: Partial<Cv>) => void)
    | ((updater: (cv: Cv) => Cv) => void);
}

export default function CvOptimizer({ cvId, onUpdateCv }: CvOptimizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  const dispatch = useAppDispatch();
  const suggestions = useCvOptimizationSuggestions();
  const loadingState = useCvOptimizationLoadingState();
  const error = useCvOptimizationErrors();
  const cv = useCvDetailById(cvId);
  const history = useCvOptimizationHistory();
  const isLoading = loadingState === LoadingState.loading;

  const handleOptimize = async () => {
    try {
      await dispatch(
        optimizeCvById({ cvId, jobTitle, jobDescription }),
      ).unwrap();
      setActiveTab('summary');
    } catch (error) {
      console.error('Failed to optimize CV:', error);
      toast.error('Failed to optimize CV. Please try again.');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    dispatch(clearOptimizationSuggestions());
    setJobTitle('');
    setJobDescription('');
    setActiveTab('summary');
  };

  const handleApplySummary = () => {
    if (suggestions?.summary && cv) {
      const summaryText = suggestions.summary.suggestion;

      if (summaryText !== cv.summary) {
        onUpdateCv((currentCv: Cv) => ({
          ...currentCv,
          summary: summaryText,
        }));
        toast.success('Summary updated successfully!');
      } else {
        toast.info('No changes detected in summary');
      }
    }
  };

  const handleApplySkills = () => {
    if (
      suggestions?.skills &&
      suggestions.skills.suggestions &&
      Array.isArray(suggestions.skills.suggestions) &&
      cv
    ) {
      try {
        const newSkills = [...suggestions.skills.suggestions];
        const currentSkills = [...(cv.skills || [])];
        const skillsChanged =
          JSON.stringify(newSkills.sort()) !==
          JSON.stringify(currentSkills.sort());

        if (skillsChanged) {
          onUpdateCv((currentCv: Cv) => ({
            ...currentCv,
            skills: newSkills,
          }));
          toast.success('Skills updated successfully!');
        } else {
          toast.info('No changes detected in skills');
        }
      } catch (error) {
        console.error('Error applying skills:', error);
        toast.error('Failed to apply skills. Please try again.');
      }
    } else {
      toast.error('Unable to apply skills. Invalid data format.');
    }
  };

  const handleApplyExperienceSuggestion = (index: number, field: string) => {
    if (suggestions?.experience && cv) {
      const experienceItem = suggestions.experience.find(
        (exp) => exp.index === index,
      );
      if (experienceItem) {
        const updatedText = experienceItem.suggestion;

        if (
          cv.experience[index] &&
          cv.experience[index][field as keyof Experience] !== updatedText
        ) {
          const updatedExperience = [...cv.experience];
          updatedExperience[index] = {
            ...updatedExperience[index],
            [field as keyof Experience]: updatedText,
          };

          onUpdateCv((currentCv: Cv) => ({
            ...currentCv,
            experience: updatedExperience,
          }));

          toast.success('Experience updated successfully!');
        } else {
          toast.info('No changes detected in experience');
        }
      }
    }
  };

  const handleApplyEducationSuggestion = (index: number, field: string) => {
    if (suggestions?.education && cv) {
      const educationItem = suggestions.education.find(
        (edu) => edu.index === index,
      );
      if (educationItem) {
        const updatedText = educationItem.suggestion;

        if (
          cv.education[index] &&
          cv.education[index][field as keyof Education] !== updatedText
        ) {
          const updatedEducation = [...cv.education];
          updatedEducation[index] = {
            ...updatedEducation[index],
            [field as keyof Education]: updatedText,
          };

          onUpdateCv((currentCv: Cv) => ({
            ...currentCv,
            education: updatedEducation,
          }));

          toast.success('Education updated successfully!');
        } else {
          toast.info('No changes detected in education');
        }
      }
    }
  };

  const handleRestoreFromHistory = (index: number) => {
    if (history && history[index]) {
      dispatch(restoreFromHistory(history[index].suggestions));
      setActiveTab('summary');
      toast.info('Restored suggestions from history');
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'summary':
        return <FileText className="h-4 w-4" />;
      case 'skills':
        return <Target className="h-4 w-4" />;
      case 'experience':
        return <Briefcase className="h-4 w-4" />;
      case 'education':
        return <GraduationCap className="h-4 w-4" />;
      case 'history':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl"
      >
        <Sparkles className="h-4 w-4" />
        AI Optimize CV
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden sm:max-w-2xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              AI-Powered CV Optimization
            </DialogTitle>
            <DialogDescription className="text-base">
              Transform your CV with AI-driven suggestions tailored to specific
              job positions.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-180px)] flex-1">
            <div className="p-4">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                    <Zap className="absolute inset-0 m-auto h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">
                    AI is analyzing your CV
                  </h3>
                  <p className="mt-2 max-w-md text-center text-sm text-gray-500">
                    Our AI is carefully reviewing your CV against the job
                    requirements to provide personalized optimization
                    suggestions.
                  </p>
                </div>
              )}

              {!isLoading && !suggestions ? (
                <div className="max-h-[60vh] space-y-6 overflow-y-auto py-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                      <label
                        htmlFor="jobTitle"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <Briefcase className="h-4 w-4" />
                        Job Title
                      </label>
                      <Input
                        id="jobTitle"
                        placeholder="e.g., Senior Frontend Developer, Data Scientist"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-3 md:row-span-2">
                      <label
                        htmlFor="jobDescription"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <FileText className="h-4 w-4" />
                        Job Description
                      </label>
                      <Textarea
                        id="jobDescription"
                        placeholder="Paste the complete job description here for the most accurate optimization results..."
                        rows={8}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="resize-none"
                      />
                    </div>
                  </div>

                  {history && history.length > 0 && (
                    <Card className="border-dashed">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <History className="h-4 w-4 text-purple-600" />
                          Quick Restore
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-3 pr-4">
                          {history.slice(0, 4).map((item, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestoreFromHistory(index)}
                              className="h-auto w-[100%] justify-start p-3 hover:border-purple-200 hover:bg-purple-50"
                            >
                              <div className="w-full text-left">
                                <p className="max-w-[100%] truncate text-sm font-medium">
                                  {item.jobTitle || 'Untitled Position'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {format(
                                    new Date(item.timestamp),
                                    'MMM d, h:mm a',
                                  )}
                                </p>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex justify-end gap-3 border-t pt-4">
                    <Button variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleOptimize}
                      disabled={isLoading || (!jobTitle && !jobDescription)}
                      className="min-w-32 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Optimizing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Optimize CV
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : !isLoading && suggestions ? (
                <div className="flex h-full flex-col space-y-4 py-4">
                  <Alert className="border-purple-200 bg-purple-50">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <AlertDescription className="text-purple-800">
                      <strong>Optimization Complete!</strong> Review the AI
                      suggestions below and apply the ones that best fit your
                      profile.
                    </AlertDescription>
                  </Alert>

                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="flex min-h-0 flex-1 flex-col"
                  >
                    <TabsList className="mb-4 grid w-full grid-cols-5">
                      <TabsTrigger
                        value="summary"
                        className="flex items-center gap-2"
                      >
                        {getTabIcon('summary')}
                        <span className="hidden sm:inline">Summary</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="skills"
                        className="flex items-center gap-2"
                      >
                        {getTabIcon('skills')}
                        <span className="hidden sm:inline">Skills</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="experience"
                        className="flex items-center gap-2"
                      >
                        {getTabIcon('experience')}
                        <span className="hidden sm:inline">Experience</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="education"
                        className="flex items-center gap-2"
                      >
                        {getTabIcon('education')}
                        <span className="hidden sm:inline">Education</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="history"
                        className="flex items-center gap-2"
                      >
                        {getTabIcon('history')}
                        <span className="hidden sm:inline">History</span>
                      </TabsTrigger>
                    </TabsList>

                    <div className="min-h-0 flex-1 overflow-hidden">
                      <TabsContent
                        value="summary"
                        className="h-full space-y-4 data-[state=active]:block"
                      >
                        {suggestions.summary ? (
                          <Card className="border-green-200">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-green-600" />
                                Optimized Professional Summary
                              </CardTitle>
                              <CardDescription>
                                AI-crafted summary that highlights your key
                                strengths for this role.
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="rounded-lg border-l-4 border-l-green-500 bg-gray-50 p-4">
                                <p className="text-sm leading-relaxed">
                                  {suggestions.summary.suggestion}
                                </p>
                              </div>
                              {suggestions.summary.reason && (
                                <Alert>
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    <strong>Why this works:</strong>{' '}
                                    {suggestions.summary.reason}
                                  </AlertDescription>
                                </Alert>
                              )}
                            </CardContent>
                            <CardFooter>
                              <Button
                                onClick={handleApplySummary}
                                className="ml-auto bg-green-600 text-white hover:bg-green-700"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Apply Summary
                              </Button>
                            </CardFooter>
                          </Card>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12">
                            <FileText className="mb-4 h-12 w-12 text-gray-300" />
                            <p className="text-gray-500">
                              No summary suggestions available.
                            </p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent
                        value="skills"
                        className="h-full space-y-4 data-[state=active]:block"
                      >
                        {suggestions.skills &&
                        suggestions.skills.suggestions.length > 0 ? (
                          <Card className="border-blue-200">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-blue-600" />
                                Recommended Skills
                              </CardTitle>
                              <CardDescription>
                                Skills that align with the job requirements and
                                industry standards.
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="rounded-lg border-l-4 border-l-blue-500 bg-blue-50 p-4">
                                <div className="flex flex-wrap gap-2">
                                  {suggestions.skills.suggestions.map(
                                    (skill, index) => (
                                      <Badge
                                        key={index}
                                        className="bg-blue-100 text-blue-800 transition-colors hover:bg-blue-200"
                                      >
                                        {skill}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </div>
                              {suggestions.skills.reason && (
                                <Alert>
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    <strong>Why these skills:</strong>{' '}
                                    {suggestions.skills.reason}
                                  </AlertDescription>
                                </Alert>
                              )}
                            </CardContent>
                            <CardFooter>
                              <Button
                                onClick={handleApplySkills}
                                className="ml-auto bg-blue-600 text-white hover:bg-blue-700"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Apply All Skills
                              </Button>
                            </CardFooter>
                          </Card>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12">
                            <Target className="mb-4 h-12 w-12 text-gray-300" />
                            <p className="text-gray-500">
                              No skill suggestions available.
                            </p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent
                        value="experience"
                        className="h-full space-y-4 data-[state=active]:block"
                      >
                        {suggestions.experience &&
                        suggestions.experience.length > 0 ? (
                          <div className="space-y-4 pb-4">
                            {suggestions.experience.map((exp, index) => (
                              <Card key={index} className="border-orange-200">
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-orange-600" />
                                    Experience Enhancement #{exp.index + 1}
                                  </CardTitle>
                                  <CardDescription>
                                    Improved {exp.field} description
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="rounded-lg border-l-4 border-l-orange-500 bg-orange-50 p-4">
                                    <p className="text-sm leading-relaxed">
                                      {exp.suggestion}
                                    </p>
                                  </div>
                                  {exp.reason && (
                                    <Alert>
                                      <AlertCircle className="h-4 w-4" />
                                      <AlertDescription>
                                        <strong>Enhancement rationale:</strong>{' '}
                                        {exp.reason}
                                      </AlertDescription>
                                    </Alert>
                                  )}
                                </CardContent>
                                <CardFooter>
                                  <Button
                                    onClick={() =>
                                      handleApplyExperienceSuggestion(
                                        exp.index,
                                        exp.field,
                                      )
                                    }
                                    className="ml-auto bg-orange-600 text-white hover:bg-orange-700"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Apply Enhancement
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12">
                            <Briefcase className="mb-4 h-12 w-12 text-gray-300" />
                            <p className="text-gray-500">
                              No experience suggestions available.
                            </p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent
                        value="education"
                        className="h-full space-y-4 data-[state=active]:block"
                      >
                        {suggestions.education &&
                        suggestions.education.length > 0 ? (
                          <div className="space-y-4 pb-4">
                            {suggestions.education.map((edu, index) => (
                              <Card key={index} className="border-purple-200">
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-purple-600" />
                                    Education Enhancement #{edu.index + 1}
                                  </CardTitle>
                                  <CardDescription>
                                    Improved {edu.field} description
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="rounded-lg border-l-4 border-l-purple-500 bg-purple-50 p-4">
                                    <p className="text-sm leading-relaxed">
                                      {edu.suggestion}
                                    </p>
                                  </div>
                                  {edu.reason && (
                                    <Alert>
                                      <AlertCircle className="h-4 w-4" />
                                      <AlertDescription>
                                        <strong>Enhancement rationale:</strong>{' '}
                                        {edu.reason}
                                      </AlertDescription>
                                    </Alert>
                                  )}
                                </CardContent>
                                <CardFooter>
                                  <Button
                                    onClick={() =>
                                      handleApplyEducationSuggestion(
                                        edu.index,
                                        edu.field,
                                      )
                                    }
                                    className="ml-auto bg-purple-600 text-white hover:bg-purple-700"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Apply Enhancement
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12">
                            <GraduationCap className="mb-4 h-12 w-12 text-gray-300" />
                            <p className="text-gray-500">
                              No education suggestions available.
                            </p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent
                        value="history"
                        className="h-full max-w-2xl data-[state=active]:block"
                      >
                        <OptimizationHistory
                          history={history || []}
                          onRestore={handleRestoreFromHistory}
                        />
                      </TabsContent>
                    </div>
                  </Tabs>

                  <div className="flex items-center justify-between border-t pt-4">
                    <Button variant="outline" onClick={handleClose}>
                      Close
                    </Button>
                    <Button
                      onClick={handleOptimize}
                      disabled={isLoading || (!jobTitle && !jobDescription)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Re-Optimize
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import {
  optimizeCvById,
  fetchOptimizationHistory,
  restoreFromHistoryById,
  useCvOptimizationSuggestions,
  useCvOptimizationLoadingState,
  useCvOptimizationHistory,
  useCvOptimizationHistoryLoadingState,
  clearOptimizationSuggestions,
  useCvDetailById,
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
  Zap,
  RefreshCw,
} from 'lucide-react';
import type { Cv, Experience, Education } from '@/types/Cv';
import { toast } from 'react-toastify';
import OptimizationHistory from './OptimizationHistory';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAiPoints, useUser } from '@/services/state/userSlice';
import { CvOptimizationHistoryItem } from '@/services/api/cv/cv-api';
import { AiLimitModal } from '@/components/AiLimitModal';

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
  const cv = useCvDetailById(cvId);
  const history = useCvOptimizationHistory();
  const historyLoadingState = useCvOptimizationHistoryLoadingState();
  const isLoading = loadingState === LoadingState.loading;
  const isHistoryLoading = historyLoadingState === LoadingState.loading;
  const user = useUser();
  const userId = user?.data?.id;
  const [showLimitModal, setShowLimitModal] = useState(false);
  const points = useAiPoints();
  // Load history từ API khi mở dialog
  useEffect(() => {
    if (isOpen && cvId) {
      dispatch(fetchOptimizationHistory({ cvId, limit: 10, offset: 0 }));
    }
  }, [isOpen, cvId, dispatch]);

  const handleOptimize = async () => {
    if (points <= 0) {
      setShowLimitModal(true);
      return;
    }

    try {
      if (!userId) {
      }

      await dispatch(
        optimizeCvById({
          cvId,
          jobTitle,
          jobDescription,
          userId: Number(userId),
        }),
      ).unwrap();

      // Refresh history sau khi optimize thành công
      dispatch(fetchOptimizationHistory({ cvId, limit: 10, offset: 0 }));

      setActiveTab('summary');
      toast.success('CV optimized successfully!');
    } catch (error) {
      console.error('Failed to optimize CV:', error);
      toast.error('Failed to optimize CV. Please try again.');
    }
  };

  const handleUpgrade = () => {
    //TODO: implement pricing page
  };

  const handleClose = () => {
    setIsOpen(false);
    dispatch(clearOptimizationSuggestions());
    setJobTitle('');
    setJobDescription('');
    setActiveTab('summary');
  };

  const handleApplySummarySuggestion = () => {
    if (suggestions?.summary && cv) {
      const updatedSummary = suggestions.summary.suggestion;
      if (cv.summary !== updatedSummary) {
        onUpdateCv((currentCv: Cv) => ({
          ...currentCv,
          summary: updatedSummary,
        }));
        toast.success('Summary updated successfully!');
      } else {
        toast.info('No changes detected in summary');
      }
    }
  };

  const handleApplySkillsSuggestion = () => {
    if (suggestions?.skills && cv) {
      const updatedSkills = suggestions.skills.suggestions;
      const currentSkillsStr = JSON.stringify(cv.skills?.sort());
      const updatedSkillsStr = JSON.stringify(updatedSkills.sort());

      if (currentSkillsStr !== updatedSkillsStr) {
        onUpdateCv((currentCv: Cv) => ({
          ...currentCv,
          skills: updatedSkills,
        }));
        toast.success('Skills updated successfully!');
      } else {
        toast.info('No changes detected in skills');
      }
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

  // Restore từ history thông qua API
  const handleRestoreFromHistory = async (
    historyItem: CvOptimizationHistoryItem,
  ) => {
    try {
      await dispatch(restoreFromHistoryById(historyItem.id)).unwrap();

      // Apply optimized CV to current CV
      if (historyItem.optimizedCv) {
        onUpdateCv((currentCv: Cv) => ({
          ...currentCv,
          ...historyItem.optimizedCv,
        }));
      }

      setActiveTab('summary');
      toast.success('Successfully restored from history!');
    } catch (error) {
      console.error('Failed to restore from history:', error);
      toast.error('Failed to restore from history');
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

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden sm:max-w-2xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              AI-Powered CV Optimization
              <span
                className={`ml-auto text-sm font-normal ${
                  points > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                • {points} points
              </span>
            </DialogTitle>
            <DialogDescription className="mt-2 text-base text-gray-600">
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
                        placeholder="Paste the full job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="min-h-[200px] resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-6">
                    <p className="text-sm text-gray-500">
                      Provide detailed job information for better optimization
                      results
                    </p>
                    <Button
                      onClick={handleOptimize}
                      disabled={isLoading || !jobTitle}
                      className="min-w-[140px]"
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

                  <AiLimitModal
                    isOpen={showLimitModal}
                    onClose={() => setShowLimitModal(false)}
                    onUpgrade={handleUpgrade}
                  />
                  {/* History Section */}
                  {history && history.length > 0 && (
                    <div className="border-t pt-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                          <History className="h-5 w-5" />
                          Recent Optimizations
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            dispatch(
                              fetchOptimizationHistory({
                                cvId,
                                limit: 10,
                                offset: 0,
                              }),
                            )
                          }
                          disabled={isHistoryLoading}
                        >
                          {isHistoryLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <OptimizationHistory
                        history={history}
                        onRestore={handleRestoreFromHistory}
                        className="max-h-[300px] overflow-y-auto"
                      />
                    </div>
                  )}
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

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger
                        value="summary"
                        className="flex items-center gap-1"
                      >
                        {getTabIcon('summary')}
                        <span className="hidden sm:inline">Summary</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="skills"
                        className="flex items-center gap-1"
                      >
                        {getTabIcon('skills')}
                        <span className="hidden sm:inline">Skills</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="experience"
                        className="flex items-center gap-1"
                      >
                        {getTabIcon('experience')}
                        <span className="hidden sm:inline">Experience</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="education"
                        className="flex items-center gap-1"
                      >
                        {getTabIcon('education')}
                        <span className="hidden sm:inline">Education</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="history"
                        className="flex items-center gap-1"
                      >
                        {getTabIcon('history')}
                        <span className="hidden sm:inline">History</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Summary Tab */}
                    <TabsContent value="summary" className="mt-4">
                      {suggestions.summary ? (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Summary Suggestion
                            </CardTitle>
                            <CardDescription>
                              AI-optimized professional summary
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="rounded-lg bg-blue-50 p-4">
                                <p className="text-sm text-gray-700">
                                  {suggestions.summary.suggestion}
                                </p>
                              </div>
                              <div className="rounded-lg bg-gray-50 p-3">
                                <p className="mb-1 text-xs font-medium text-gray-500">
                                  Why this change?
                                </p>
                                <p className="text-sm text-gray-600">
                                  {suggestions.summary.reason}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              onClick={handleApplySummarySuggestion}
                              className="w-full"
                            >
                              Apply Summary
                            </Button>
                          </CardFooter>
                        </Card>
                      ) : (
                        <p className="text-center text-gray-500">
                          No summary suggestions available
                        </p>
                      )}
                    </TabsContent>

                    {/* Skills Tab */}
                    <TabsContent value="skills" className="mt-4">
                      {suggestions.skills ? (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Skills Suggestions
                            </CardTitle>
                            <CardDescription>
                              Recommended skills for the position
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex flex-wrap gap-2">
                                {suggestions.skills.suggestions.map(
                                  (skill, index) => (
                                    <Badge key={index} variant="secondary">
                                      {skill}
                                    </Badge>
                                  ),
                                )}
                              </div>
                              <div className="rounded-lg bg-gray-50 p-3">
                                <p className="mb-1 text-xs font-medium text-gray-500">
                                  Why these skills?
                                </p>
                                <p className="text-sm text-gray-600">
                                  {suggestions.skills.reason}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              onClick={handleApplySkillsSuggestion}
                              className="w-full"
                            >
                              Apply Skills
                            </Button>
                          </CardFooter>
                        </Card>
                      ) : (
                        <p className="text-center text-gray-500">
                          No skills suggestions available
                        </p>
                      )}
                    </TabsContent>

                    {/* Experience Tab */}
                    <TabsContent value="experience" className="mt-4 space-y-4">
                      {suggestions.experience &&
                      suggestions.experience.length > 0 ? (
                        suggestions.experience.map((exp, index) => (
                          <Card key={index}>
                            <CardHeader>
                              <CardTitle className="text-base">
                                Experience Item #{index + 1}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="rounded-lg bg-blue-50 p-3">
                                  <p className="text-sm text-gray-700">
                                    {exp.suggestion}
                                  </p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3">
                                  <p className="mb-1 text-xs font-medium text-gray-500">
                                    Reason
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {exp.reason}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <Button
                                onClick={() =>
                                  handleApplyExperienceSuggestion(
                                    exp.index,
                                    exp.field,
                                  )
                                }
                                className="w-full"
                                size="sm"
                              >
                                Apply This Change
                              </Button>
                            </CardFooter>
                          </Card>
                        ))
                      ) : (
                        <p className="text-center text-gray-500">
                          No experience suggestions available
                        </p>
                      )}
                    </TabsContent>

                    {/* Education Tab */}
                    <TabsContent value="education" className="mt-4 space-y-4">
                      {suggestions.education &&
                      suggestions.education.length > 0 ? (
                        suggestions.education.map((edu, index) => (
                          <Card key={index}>
                            <CardHeader>
                              <CardTitle className="text-base">
                                Education Item #{index + 1}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="rounded-lg bg-blue-50 p-3">
                                  <p className="text-sm text-gray-700">
                                    {edu.suggestion}
                                  </p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3">
                                  <p className="mb-1 text-xs font-medium text-gray-500">
                                    Reason
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {edu.reason}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <Button
                                onClick={() =>
                                  handleApplyEducationSuggestion(
                                    edu.index,
                                    edu.field,
                                  )
                                }
                                className="w-full"
                                size="sm"
                              >
                                Apply This Change
                              </Button>
                            </CardFooter>
                          </Card>
                        ))
                      ) : (
                        <p className="text-center text-gray-500">
                          No education suggestions available
                        </p>
                      )}
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="mt-4">
                      <OptimizationHistory
                        history={history}
                        onRestore={handleRestoreFromHistory}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              ) : null}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Camera, 
  Upload, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  BookPlus, 
  Leaf, 
  Info,
  RefreshCw
} from "lucide-react";

import { IdentificationResult } from "@/types";
import { uploadFileApi, fetchApi } from "@/lib/api";

export default function NatureExplorerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [identifying, setIdentifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [idResult, setIdResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState<string>("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, or WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size exceeds the 10MB limit.");
      return;
    }

    setError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIdResult(null);
    setSavedSuccess(false);
  };

  const handleIdentify = async () => {
    if (!selectedFile) return;

    try {
      setIdentifying(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const result = await uploadFileApi<IdentificationResult>("/discoveries/identify", formData);
      setIdResult(result);
    } catch (err: any) {
      setError(err.message || "Failed to identify plant image.");
    } finally {
      setIdentifying(false);
    }
  };

  const handleSaveToJournal = async () => {
    if (!idResult) return;
    try {
      setSaving(true);
      await fetchApi("/discoveries", {
        method: "POST",
        body: JSON.stringify({
          title: idResult.common_name,
          common_name: idResult.common_name,
          scientific_name: idResult.scientific_name,
          category: idResult.category || "Plant",
          notes: userNotes || idResult.care_or_nature_notes,
          confidence: idResult.confidence,
          is_verified_by_ai: true,
          identification_provider: idResult.provider
        })
      });
      setSavedSuccess(true);
      setTimeout(() => {
        router.push("/journal");
      }, 1500);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5E9] text-[#245C43] text-xs font-semibold">
          <Leaf className="w-3.5 h-3.5 text-[#245C43]" />
          <span>Multimodal Plant & Flora Recognition</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18382A]">
          Nature Explorer
        </h1>
        <p className="text-sm sm:text-base text-[#6F8174] max-w-xl mx-auto">
          Photograph local flowers, trees, moss, or wildlife. Get instant botanical insights, ecological notes, and save observations to your journal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload & Preview Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D6E8D1] shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#18382A] flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#245C43]" /> Capture or Upload Specimen
            </h3>

            {/* Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#D6E8D1] hover:border-[#245C43] bg-[#F8FBF5] rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              {previewUrl ? (
                <div className="space-y-3">
                  <div className="w-full h-48 rounded-xl overflow-hidden bg-black/5 flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Uploaded flora preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-[#245C43] font-semibold">Click to choose another photo</p>
                </div>
              ) : (
                <div className="space-y-3 py-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF5E9] text-[#245C43] mx-auto flex items-center justify-center">
                    <Upload className="w-6 h-6 text-[#245C43]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#18382A]">Click or tap to upload photo</p>
                    <p className="text-xs text-[#6F8174]">JPEG, PNG, or WEBP up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                {error}
              </div>
            )}
          </div>

          <button
            onClick={handleIdentify}
            disabled={!selectedFile || identifying}
            className="w-full py-3.5 rounded-xl bg-[#245C43] hover:bg-[#19402e] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {identifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing Botanical Features...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#E7C76A]" />
                Identify Specimen
              </>
            )}
          </button>
        </div>

        {/* Results Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D6E8D1] shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#18382A]">Identification Findings</h3>
            <p className="text-xs text-[#6F8174]">Insights generated through AI vision models</p>
          </div>

          {idResult ? (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-[#EAF5E9] border border-[#A8D5A2] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#245C43]">
                    {idResult.category}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-[#245C43]">
                    {Math.round(idResult.confidence * 100)}% Confidence
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#18382A]">{idResult.common_name}</h2>
                {idResult.scientific_name && (
                  <p className="text-xs text-[#245C43] italic font-medium">{idResult.scientific_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#18382A]">Botanical Description</h4>
                <p className="text-xs text-[#6F8174] leading-relaxed">{idResult.description}</p>
              </div>

              {idResult.care_or_nature_notes && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#18382A]">Ecological Significance</h4>
                  <p className="text-xs text-[#6F8174] leading-relaxed">{idResult.care_or_nature_notes}</p>
                </div>
              )}

              {/* Safety disclaimer */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[11px]">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" /> Safety Advisory:
                </div>
                <p className="text-[11px] leading-snug">{idResult.safety_disclaimer}</p>
              </div>

              {/* Save observation notes */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#18382A]">Your Field Notes</label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Found near the sunny side of the stone trail..."
                  className="w-full h-20 p-2.5 rounded-xl border border-[#D6E8D1] bg-[#F8FBF5] text-xs resize-none focus:ring-2 focus:ring-[#245C43] focus:outline-none"
                />
              </div>

              <button
                onClick={handleSaveToJournal}
                disabled={saving || savedSuccess}
                className="w-full py-3 rounded-xl bg-[#245C43] hover:bg-[#19402e] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#A8D5A2]" />
                    Saved to Field Journal!
                  </>
                ) : saving ? (
                  "Saving..."
                ) : (
                  <>
                    <BookPlus className="w-4 h-4 text-[#E7C76A]" />
                    Save Observation (+25 XP)
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Leaf className="w-12 h-12 text-[#6F8174]/40 mx-auto" />
              <p className="text-sm font-medium text-[#6F8174]">
                Upload a plant or nature picture on the left to see identification suggestions.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FBF5] border border-[#D6E8D1] text-[11px] text-[#6F8174]">
                <Info className="w-3.5 h-3.5 text-[#245C43]" /> Supports flowers, trees, fungi & leaves
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

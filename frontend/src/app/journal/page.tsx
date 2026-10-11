"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  MapPin, 
  Leaf, 
  CheckCircle2, 
  Sparkles,
  Camera
} from "lucide-react";

import { Discovery } from "@/types";
import { fetchApi } from "@/lib/api";

const CATEGORIES = ["All", "Plant", "Tree", "Fungi", "Bird", "Insect", "Other"];

export default function NatureJournalPage() {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal for new manual entry
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [commonName, setCommonName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [category, setCategory] = useState("Plant");
  const [notes, setNotes] = useState("");
  const [locationName, setLocationName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadDiscoveries = async () => {
    try {
      setLoading(true);
      const res = await fetchApi<Discovery[]>("/discoveries");
      setDiscoveries(res);
    } catch (err: any) {
      setError(err.message || "Failed to load discoveries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscoveries();
  }, []);

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      setSubmitting(true);
      await fetchApi("/discoveries", {
        method: "POST",
        body: JSON.stringify({
          title,
          common_name: commonName || title,
          scientific_name: scientificName,
          category,
          notes,
          location_name: locationName,
          is_verified_by_ai: false,
          identification_provider: "manual"
        })
      });
      setShowAddModal(false);
      setTitle("");
      setCommonName("");
      setScientificName("");
      setNotes("");
      setLocationName("");
      await loadDiscoveries();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this observation?")) return;
    try {
      await fetchApi(`/discoveries/${id}`, { method: "DELETE" });
      setDiscoveries(discoveries.filter(d => d.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredDiscoveries = discoveries.filter((d) => {
    const matchesCategory = selectedCategory === "All" || d.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.common_name && d.common_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.scientific_name && d.scientific_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.notes && d.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-[#245C43]" />
            <h1 className="text-3xl font-extrabold text-[#18382A]">Nature Journal</h1>
          </div>
          <p className="text-sm text-[#6F8174]">
            Your living herbarium and outdoor field observation logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/explorer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#D6E8D1] text-[#245C43] text-sm font-semibold hover:bg-[#EAF5E9]"
          >
            <Camera className="w-4 h-4" /> AI Identifier
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#245C43] hover:bg-[#19402e] text-white text-sm font-semibold shadow-xs transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-[#A8D5A2]" /> Add Entry
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#D6E8D1] shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#6F8174] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search flora, species, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8FBF5] border border-[#D6E8D1] text-xs text-[#18382A] focus:outline-none focus:ring-2 focus:ring-[#245C43]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-[#245C43] text-white"
                  : "bg-[#F8FBF5] text-[#6F8174] hover:bg-[#EAF5E9] hover:text-[#245C43]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Discoveries List / Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-[#245C43] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-[#6F8174] mt-3">Loading journal records...</p>
        </div>
      ) : filteredDiscoveries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiscoveries.map((disc) => (
            <div
              key={disc.id}
              className="p-6 rounded-3xl bg-white border border-[#D6E8D1] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EAF5E9] text-[#245C43]">
                    {disc.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {disc.is_verified_by_ai && (
                      <span className="text-[10px] flex items-center gap-1 text-[#245C43] font-semibold">
                        <Sparkles className="w-3 h-3 text-[#E7C76A]" /> AI Identified
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(disc.id)}
                      className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#18382A]">{disc.common_name || disc.title}</h3>
                  {disc.scientific_name && (
                    <p className="text-xs italic text-[#245C43] font-medium">{disc.scientific_name}</p>
                  )}
                </div>

                {disc.notes && (
                  <p className="text-xs text-[#6F8174] line-clamp-3 leading-relaxed">
                    {disc.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#D6E8D1]/60 flex items-center justify-between text-[11px] text-[#6F8174]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(disc.discovered_at).toLocaleDateString()}
                </span>
                {disc.location_name && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#245C43]" />
                    {disc.location_name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#D6E8D1] space-y-3 max-w-md mx-auto">
          <Leaf className="w-12 h-12 text-[#245C43]/40 mx-auto" />
          <h3 className="text-lg font-bold text-[#18382A]">No Journal Entries Found</h3>
          <p className="text-xs text-[#6F8174] leading-relaxed">
            Record a tree, flower, or sensory observation to expand your outdoor journal.
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-[#245C43] text-white text-xs font-bold"
            >
              Add Observation
            </button>
          </div>
        </div>
      )}

      {/* Add Manual Observation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-xl border border-[#D6E8D1]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#18382A]">Log Field Observation</h3>
              <span className="text-xs font-bold text-[#245C43] bg-[#EAF5E9] px-2.5 py-0.5 rounded-full">+25 XP</span>
            </div>

            <form onSubmit={handleCreateManual} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-[#18382A]">Specimen Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Purple Coneflower"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D6E8D1] bg-[#F8FBF5] text-xs text-[#18382A] focus:outline-none focus:ring-2 focus:ring-[#245C43]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-[#18382A]">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D6E8D1] bg-[#F8FBF5] text-xs text-[#18382A] focus:outline-none focus:ring-2 focus:ring-[#245C43]"
                  >
                    {CATEGORIES.filter(c => c !== "All").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-[#18382A]">Scientific Name</label>
                  <input
                    type="text"
                    placeholder="Echinacea purpurea"
                    value={scientificName}
                    onChange={(e) => setScientificName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D6E8D1] bg-[#F8FBF5] text-xs text-[#18382A] focus:outline-none focus:ring-2 focus:ring-[#245C43]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-[#18382A]">Location (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. City Botanical Garden, South Trail"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D6E8D1] bg-[#F8FBF5] text-xs text-[#18382A] focus:outline-none focus:ring-2 focus:ring-[#245C43]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-[#18382A]">Field Notes & Texture</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Noticed three honeybees feeding on the center cone. Leaves were coarse to the touch..."
                  className="w-full h-24 p-2.5 rounded-xl border border-[#D6E8D1] bg-[#F8FBF5] text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#245C43]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6F8174] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#245C43] text-white text-xs font-bold shadow-xs hover:bg-[#19402e]"
                >
                  {submitting ? "Saving..." : "Save Discovery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";
import { Slider } from "@/react-app/components/ui/slider";
import { communities } from "@/react-app/data/communities";
import { Search, SlidersHorizontal, X } from "lucide-react";

export interface FilterValues {
  search: string;
  gender: string;
  community: string;
  ageMin: number;
  ageMax: number;
  maritalStatus: string;
  education: string;
  state: string;
}

interface ProfileFiltersProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  showMobileFilters: boolean;
  onCloseMobileFilters: () => void;
}

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal"
];

const educationLevels = [
  "High School", "Diploma", "Bachelor's", "Master's", "Doctorate", "Professional Degree"
];

const maritalStatuses = [
  "Never Married", "Divorced", "Widowed", "Awaiting Divorce"
];

export function ProfileFilters({ 
  filters, 
  onFilterChange, 
  showMobileFilters,
  onCloseMobileFilters 
}: ProfileFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key: keyof FilterValues, value: string | number) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleAgeChange = (values: number[]) => {
    const updated = { ...localFilters, ageMin: values[0], ageMax: values[1] };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const cleared: FilterValues = {
      search: "",
      gender: "all",
      community: "all",
      ageMin: 18,
      ageMax: 50,
      maritalStatus: "all",
      education: "all",
      state: "all",
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, city..."
            className="pl-9"
            value={localFilters.search}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>
      </div>

      {/* Looking For */}
      <div className="space-y-2">
        <Label>Looking For</Label>
        <Select
          value={localFilters.gender}
          onValueChange={(v) => handleChange("gender", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="female">Bride</SelectItem>
            <SelectItem value="male">Groom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Community */}
      <div className="space-y-2">
        <Label>Community</Label>
        <Select
          value={localFilters.community}
          onValueChange={(v) => handleChange("community", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select community" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Communities</SelectItem>
            {communities.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.icon} {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Age Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Age Range</Label>
          <span className="text-sm text-muted-foreground">
            {localFilters.ageMin} - {localFilters.ageMax} years
          </span>
        </div>
        <Slider
          min={18}
          max={60}
          step={1}
          value={[localFilters.ageMin, localFilters.ageMax]}
          onValueChange={handleAgeChange}
          className="py-2"
        />
      </div>

      {/* Marital Status */}
      <div className="space-y-2">
        <Label>Marital Status</Label>
        <Select
          value={localFilters.maritalStatus}
          onValueChange={(v) => handleChange("maritalStatus", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {maritalStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Education */}
      <div className="space-y-2">
        <Label>Education</Label>
        <Select
          value={localFilters.education}
          onValueChange={(v) => handleChange("education", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select education" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {educationLevels.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* State */}
      <div className="space-y-2">
        <Label>State</Label>
        <Select
          value={localFilters.state}
          onValueChange={(v) => handleChange("state", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {states.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={clearFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block sticky top-20 space-y-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
        </div>
        {filterContent}
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={onCloseMobileFilters}>
          <div 
            className="absolute right-0 top-0 bottom-0 w-80 bg-background p-6 overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onCloseMobileFilters}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}

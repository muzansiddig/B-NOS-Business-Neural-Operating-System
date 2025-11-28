import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserBusinessData } from "@/lib/user-data";
import { Edit, X } from "lucide-react";

interface DataInputFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: UserBusinessData) => void;
  initialData: UserBusinessData;
}

export function DataInputForm({ open, onClose, onSave, initialData }: DataInputFormProps) {
  const [data, setData] = useState(initialData);

  const handleChange = (field: keyof UserBusinessData, value: number) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(data);
    onClose();
  };

  const fields: Array<{
    key: keyof UserBusinessData;
    label: string;
    description: string;
  }> = [
    { key: "revenue", label: "Annual Revenue", description: "Total annual revenue ($)" },
    { key: "expenses", label: "Total Expenses", description: "Total annual expenses ($)" },
    { key: "cogs", label: "Cost of Goods Sold", description: "COGS ($)" },
    { key: "opex", label: "Operating Expenses", description: "OpEx ($)" },
    { key: "capex", label: "Capital Expenditures", description: "CapEx ($)" },
    { key: "burnRate", label: "Monthly Burn Rate", description: "Monthly burn rate ($)" },
    { key: "employees", label: "Total Employees", description: "Headcount" },
    { key: "customers", label: "Total Customers", description: "Customer count" },
    { key: "cac", label: "Customer Acquisition Cost", description: "CAC ($)" },
    { key: "ltv", label: "Customer Lifetime Value", description: "LTV ($)" },
    { key: "retentionRate", label: "Retention Rate", description: "Retention % (0-100)" },
    { key: "churnRate", label: "Churn Rate", description: "Churn % (0-100)" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Business Metrics
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key} className="text-sm">
                {field.label}
              </Label>
              <Input
                id={field.key}
                type="number"
                value={data[field.key]}
                onChange={(e) => handleChange(field.key, parseFloat(e.target.value) || 0)}
                placeholder={field.description}
                className="text-sm"
                data-testid={`input-${field.key}`}
              />
              <p className="text-xs text-muted-foreground">{field.description}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-edit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} data-testid="button-save-data">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

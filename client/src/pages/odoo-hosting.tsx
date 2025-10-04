import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, FileText, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function OdooHosting() {
  const [configs, setConfigs] = useState<string[]>(Array(30).fill(""));
  const [configLabels, setConfigLabels] = useState<string[]>(Array(30).fill(""));
  const [editingLabel, setEditingLabel] = useState<number | null>(null);
  const [tempLabel, setTempLabel] = useState("");
  const [configsCopied, setConfigsCopied] = useState<boolean[]>(Array(30).fill(false));
  const [configsSaving, setConfigsSaving] = useState<boolean[]>(Array(30).fill(false));
  const [configsSaved, setConfigsSaved] = useState<boolean[]>(Array(30).fill(false));
  const { toast } = useToast();

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('odoo_hosting_configs')
      .select('*')
      .eq('user_id', user.id)
      .order('config_index');

    if (error) {
      console.error('Error loading configs:', error);
      return;
    }

    if (data) {
      const loadedConfigs = Array(30).fill("");
      const loadedLabels = Array(30).fill("");
      data.forEach(config => {
        if (config.config_index >= 1 && config.config_index <= 30) {
          loadedConfigs[config.config_index - 1] = config.config_text;
          loadedLabels[config.config_index - 1] = config.config_label || "";
        }
      });
      setConfigs(loadedConfigs);
      setConfigLabels(loadedLabels);
    }
  };

  const updateConfigValue = (index: number, value: string) => {
    const newConfigs = [...configs];
    newConfigs[index] = value;
    setConfigs(newConfigs);
  };

  const setConfigCopied = (index: number, copied: boolean) => {
    const newConfigsCopied = [...configsCopied];
    newConfigsCopied[index] = copied;
    setConfigsCopied(newConfigsCopied);
  };

  const startEditingLabel = (index: number) => {
    setEditingLabel(index);
    setTempLabel(configLabels[index] || `Config ${index + 1}`);
  };

  const cancelEditingLabel = () => {
    setEditingLabel(null);
    setTempLabel("");
  };

  const saveLabel = async (index: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save labels",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('odoo_hosting_configs')
      .upsert({
        user_id: user.id,
        config_index: index + 1,
        config_text: configs[index] || "",
        config_label: tempLabel.trim() || null,
      }, {
        onConflict: 'user_id,config_index'
      });

    if (error) {
      console.error('Error saving label:', error);
      toast({
        title: "Error saving label",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const newLabels = [...configLabels];
    newLabels[index] = tempLabel.trim();
    setConfigLabels(newLabels);
    setEditingLabel(null);
    setTempLabel("");

    toast({
      title: "Label saved",
      description: "Config label has been updated",
    });
  };

  const saveConfig = async (index: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save configs",
        variant: "destructive",
      });
      return;
    }

    const configText = configs[index];
    if (!configText.trim()) {
      toast({
        title: "Empty config",
        description: "Please enter some text before saving",
        variant: "destructive",
      });
      return;
    }

    const newConfigsSaving = [...configsSaving];
    newConfigsSaving[index] = true;
    setConfigsSaving(newConfigsSaving);

    const { error } = await supabase
      .from('odoo_hosting_configs')
      .upsert({
        user_id: user.id,
        config_index: index + 1,
        config_text: configText,
        config_label: configLabels[index] || null,
      }, {
        onConflict: 'user_id,config_index'
      });

    const newConfigsSaving2 = [...configsSaving];
    newConfigsSaving2[index] = false;
    setConfigsSaving(newConfigsSaving2);

    if (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Error saving config",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const newConfigsSaved = [...configsSaved];
    newConfigsSaved[index] = true;
    setConfigsSaved(newConfigsSaved);

    toast({
      title: "Saved successfully",
      description: `Config ${index + 1} has been saved`,
    });

    setTimeout(() => {
      const resetSaved = [...newConfigsSaved];
      resetSaved[index] = false;
      setConfigsSaved(resetSaved);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl font-semibold text-foreground">
                Odoo Hosting Configuration
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((configNum) => {
              const configIndex = configNum - 1;
              const configValue = configs[configIndex];
              const configCopied = configsCopied[configIndex];
              const configSaving = configsSaving[configIndex];
              const configSaved = configsSaved[configIndex];

              return (
                <div key={configNum}>
                  <div className="flex items-center gap-2 mb-1.5">
                    {editingLabel === configIndex ? (
                      <>
                        <Input
                          value={tempLabel}
                          onChange={(e) => setTempLabel(e.target.value)}
                          className="h-7 text-sm"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveLabel(configIndex);
                            if (e.key === 'Escape') cancelEditingLabel();
                          }}
                        />
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => saveLabel(configIndex)}
                          className="h-7 px-2"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={cancelEditingLabel}
                          className="h-7 px-2"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Label htmlFor={`config-${configNum}`} className="text-sm font-medium text-foreground">
                          {configLabels[configIndex] || `Config ${configNum}`}
                        </Label>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => startEditingLabel(configIndex)}
                          className="h-6 px-2 text-xs"
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="relative mt-1.5">
                    <Textarea
                      id={`config-${configNum}`}
                      placeholder={`Enter config ${configNum}`}
                      value={configValue}
                      onChange={(e) => updateConfigValue(configIndex, e.target.value)}
                      className="min-h-[100px] pr-2 pb-12 resize-y"
                      rows={3}
                    />
                    <div className="absolute right-2 bottom-2 flex gap-1">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => saveConfig(configIndex)}
                        disabled={configSaving}
                        className="h-8 px-3"
                      >
                        {configSaving ? (
                          <>
                            <div className="h-3 w-3 mr-1 animate-spin rounded-full border-2 border-muted border-t-primary" />
                            Saving
                          </>
                        ) : configSaved ? (
                          <>
                            Saved
                          </>
                        ) : (
                          <>
                            Save
                          </>
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(configValue);
                          setConfigCopied(configIndex, true);
                        }}
                        className="h-8 px-3"
                      >
                        {configCopied ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Done
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

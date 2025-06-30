import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuickRoute {
  id: string;
  from: string;
  from_type: "state" | "university";
  to: string;
  to_type: "state" | "university";
  order?: number;
  enabled: boolean;
}

const AdminQuickRoutes = () => {
  const [routes, setRoutes] = useState<QuickRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    from: "",
    from_type: "state",
    to: "",
    to_type: "university",
    order: 0,
    enabled: true,
  });
  const [saving, setSaving] = useState(false);
  const [states, setStates] = useState<{ name: string }[]>([]);
  const [universities, setUniversities] = useState<
    {
      name: string;
      state: string;
    }[]
  >([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchRoutes();
    fetchStates();
    fetchUniversities();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("quick_routes")
      .select("id, from, from_type, to, to_type, order, enabled")
      .order("order", { ascending: true });
    if (!error && data) setRoutes(data);
    setLoading(false);
  };

  const fetchStates = async () => {
    const { data } = await supabase.from("states").select("name").order("name");
    setStates(data || []);
  };

  const fetchUniversities = async () => {
    const { data } = await supabase
      .from("universities")
      .select("name, state")
      .order("name");
    setUniversities(data || []);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("quick_routes").insert([
      {
        from: form.from,
        from_type: form.from_type,
        to: form.to,
        to_type: form.to_type,
        order: Number(form.order),
        enabled: form.enabled,
      },
    ]);
    setForm({
      from: "",
      from_type: "state",
      to: "",
      to_type: "university",
      order: 0,
      enabled: true,
    });
    setSaving(false);
    fetchRoutes();
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    await supabase
      .from("quick_routes")
      .update({ enabled: !enabled })
      .eq("id", id);
    fetchRoutes();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("quick_routes").delete().eq("id", id);
    fetchRoutes();
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) =>
    e.preventDefault();
  const handleDrop = async (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    const newRoutes = [...routes];
    const [moved] = newRoutes.splice(dragIndex, 1);
    newRoutes.splice(index, 0, moved);
    // Update order in DB and state
    for (let i = 0; i < newRoutes.length; i++) {
      newRoutes[i].order = i + 1;
      await supabase
        .from("quick_routes")
        .update({ order: i + 1 })
        .eq("id", newRoutes[i].id);
    }
    setRoutes(newRoutes);
    setDragIndex(null);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Manage Quick Routes</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleAdd}
          className="flex flex-col md:flex-row gap-2 mb-6 items-end"
        >
          <div className="flex-1">
            <label className="block mb-1 font-medium">From</label>
            <Select
              value={form.from_type}
              onValueChange={(val) =>
                setForm((f) => ({
                  ...f,
                  from_type: val as "state" | "university",
                  from: "",
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="state">State</SelectItem>
                <SelectItem value="university">University</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={form.from}
              onValueChange={(val) => setForm((f) => ({ ...f, from: val }))}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder={`Select ${form.from_type}`} />
              </SelectTrigger>
              <SelectContent>
                {form.from_type === "state"
                  ? states.map((state) => (
                      <SelectItem key={state.name} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))
                  : universities.map((uni) => (
                      <SelectItem key={uni.name} value={uni.name}>
                        {uni.name} ({uni.state})
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">To</label>
            <Select
              value={form.to_type}
              onValueChange={(val) =>
                setForm((f) => ({
                  ...f,
                  to_type: val as "state" | "university",
                  to: "",
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="state">State</SelectItem>
                <SelectItem value="university">University</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={form.to}
              onValueChange={(val) => setForm((f) => ({ ...f, to: val }))}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder={`Select ${form.to_type}`} />
              </SelectTrigger>
              <SelectContent>
                {form.to_type === "state"
                  ? states.map((state) => (
                      <SelectItem key={state.name} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))
                  : universities.map((uni) => (
                      <SelectItem key={uni.name} value={uni.name}>
                        {uni.name} ({uni.state})
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Order</label>
            <input
              name="order"
              type="number"
              value={form.order}
              onChange={handleChange}
              className="border p-2 rounded w-20"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Enabled</label>
            <select
              name="enabled"
              value={form.enabled ? "true" : "false"}
              onChange={(e) =>
                setForm({ ...form, enabled: e.target.value === "true" })
              }
              className="border p-2 rounded"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <Button type="submit" disabled={saving || !form.from || !form.to}>
            {saving ? "Adding..." : "Add Quick Route"}
          </Button>
        </form>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Order</th>
                <th className="p-2">Enabled</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route, idx) => (
                <tr
                  key={route.id}
                  className="border-t cursor-move"
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(idx)}
                >
                  <td className="p-2">
                    {route.from}{" "}
                    <span className="text-xs text-gray-400">
                      ({route.from_type})
                    </span>
                  </td>
                  <td className="p-2">
                    {route.to}{" "}
                    <span className="text-xs text-gray-400">
                      ({route.to_type})
                    </span>
                  </td>
                  <td className="p-2">{route.order}</td>
                  <td className="p-2">{route.enabled ? "Yes" : "No"}</td>
                  <td className="p-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggle(route.id, route.enabled)}
                    >
                      {route.enabled ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(route.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminQuickRoutes;

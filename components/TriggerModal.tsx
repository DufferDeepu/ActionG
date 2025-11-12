"use client";
import React, { useState, useEffect } from "react";
import { Node } from "reactflow";
import { TriggerNodeData, Trigger } from "./TriggerNode"; // Import new types
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

type TriggerModalProps = {
  node: Node<TriggerNodeData>;
  onClose: () => void;
  onSave: (nodeId: string, newData: TriggerNodeData) => void;
};

export default function TriggerModal({
  node,
  onClose,
  onSave,
}: TriggerModalProps) {
  // State is now an array of complex Trigger objects
  const [triggers, setTriggers] = useState<Trigger[]>(node.data.triggers || []);

  useEffect(() => {
    setTriggers(node.data.triggers || []);
  }, [node]);

  const handleSave = () => {
    onSave(node.id, { triggers });
    onClose();
  };

  // --- Main Trigger Group Helpers ---
  const addTrigger = () => {
    setTriggers([
      ...triggers,
      { event: "push", key: "branches", values: ["main"] },
    ]);
  };

  const deleteTrigger = (index: number) => {
    setTriggers(triggers.filter((_, i) => i !== index));
  };

  // Update top-level fields like 'event' or 'key'
  const handleTriggerChange = (
    index: number,
    field: "event" | "key",
    value: string
  ) => {
    const newTriggers = [...triggers];
    newTriggers[index] = { ...newTriggers[index], [field]: value };
    setTriggers(newTriggers);
  };

  // --- Inner Values List Helpers ---
  const addTriggerValue = (triggerIndex: number) => {
    const newTriggers = [...triggers];
    newTriggers[triggerIndex].values.push("new-value");
    setTriggers(newTriggers);
  };

  const deleteTriggerValue = (triggerIndex: number, valueIndex: number) => {
    const newTriggers = [...triggers];
    newTriggers[triggerIndex].values = newTriggers[triggerIndex].values.filter(
      (_, i) => i !== valueIndex
    );
    setTriggers(newTriggers);
  };

  const handleTriggerValueChange = (
    triggerIndex: number,
    valueIndex: number,
    value: string
  ) => {
    const newTriggers = [...triggers];
    newTriggers[triggerIndex].values[valueIndex] = value;
    setTriggers(newTriggers);
  };

  return (
    <Dialog open={true} onOpenChange={onClose} >
      <DialogContent className="max-w-lg p-6 bg-background">
        <DialogHeader>
          <DialogTitle>Edit Triggers (on:)</DialogTitle>
          <div>
            <Separator />
          </div>
        </DialogHeader>

        {/* Trigger Steps */}
        <div>
          <Label className="block mb-3 text-l font-semibold">Trigger</Label>
          <div className=" border rounded-xl p-2 max-h-[200px] overflow-y-auto bg-foreground/5">
            {/* Map over each Trigger Group */}
            {triggers.map((trigger, triggerIndex) => (
              <div
                key={triggerIndex}
                className="flex flex-col gap-2 mb-2 items-start"
              >
                {/* Map over each Trigger Group */}
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Event (e.g., push)"
                    value={trigger.event}
                    onChange={(e) =>
                      handleTriggerChange(triggerIndex, "event", e.target.value)
                    }
                    onFocus={(e) => e.target.select()}
                    className="flex-1 p-2 text-sm border rounded-xl"
                  />
                  <Button
                    onClick={() => deleteTrigger(triggerIndex)}
                    variant={"destructive"}
                    className="py-2 px-1 w-10 border-none rounded-xl cursor-pointer font-bold"
                  >
                    &times;
                  </Button>
                </div>
                {/* --- Key (e.g., branches) --- */}
                {/* We add an inline style for indentation */}
                <div className="flex ml-8">
                  <Input
                    type="text"
                    placeholder="Key (e.g., branches)"
                    value={trigger.key || ""}
                    onChange={(e) =>
                      handleTriggerChange(triggerIndex, "key", e.target.value)
                    }
                    onFocus={(e) => e.target.select()}
                    className="flex-1 p-2 text-sm border rounded-xl"
                  />
                </div>
                {/* --- Values (e.g., main) --- */}
                {/* We adjust the sub-list indentation to match */}
                <div className="flex flex-col gap-2">
                  {trigger.values.map((value, valueIndex) => (
                    <div key={valueIndex} className="flex gap-2 ml-16">
                      <Input
                        type="text"
                        placeholder="Value (e.g., main)"
                        value={value}
                        onChange={(e) =>
                          handleTriggerValueChange(
                            triggerIndex,
                            valueIndex,
                            e.target.value
                          )
                        }
                        onFocus={(e) => e.target.select()}
                      />
                      <Button
                        onClick={() => deleteTriggerValue(triggerIndex, valueIndex)}
                        variant={"destructive"}
                        className="font-bold w-10"
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addTriggerValue(triggerIndex)}
                    variant={"default"}
                    className="ml-16 py-2 px-3 w-26 border-none rounded-2xl"
                  >
                    + Add Value
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={addTrigger}
            variant={"default"}
            className="mt-3 py-2 px-3 w-30 border-none rounded-2xl"
          >
            + Add Trigger
          </Button>
        </div>

        {/* Actions */}
        <DialogFooter className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="py-2 px-4 border-none rounded-2xl text-base cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant={"accent"}
            className="py-2 px-4 border-none rounded-2xl text-base cursor-pointer"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

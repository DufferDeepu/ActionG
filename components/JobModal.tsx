'use client';

import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { JobNodeData, Step } from './JobNode';

// ✅ Import ShadCN dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

type JobModalProps = {
  node: Node<JobNodeData>;
  onClose: () => void;
  onSave: (nodeId: string, newData: JobNodeData) => void;
};

export default function JobModal({ node, onClose, onSave }: JobModalProps) {
  const [jobName, setJobName] = useState(node.data.jobName);
  const [runsOn, setRunsOn] = useState(node.data.runsOn);
  const [steps, setSteps] = useState<Step[]>(node.data.steps || []);

  useEffect(() => {
    setJobName(node.data.jobName);
    setRunsOn(node.data.runsOn);
    setSteps(node.data.steps || []);
  }, [node.id]);

  const handleSave = () => {
    onSave(node.id, { jobName, runsOn, steps });
    onClose();
  };

  const handleStepChange = (index: number, field: keyof Step, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };

    if (field === 'uses' && value) newSteps[index].run = '';
    else if (field === 'run' && value) newSteps[index].uses = '';

    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, { name: 'New Step', run: 'echo "hello"' }]);
  };

  const deleteStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 bg-background">
        <DialogHeader>
          <DialogTitle>Edit Job: {node.data.jobName}</DialogTitle>
        </DialogHeader>

        {/* JobName */}
        <div className="mb-3">
          <Label htmlFor="jobName" className="block mb-2 font-semibold">
            Job Name (ID)
          </Label>
          <Input
            id="jobName"
            type="text"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            className="w-full p-2 text-base border rounded-xl"
          />
        </div>

        {/* RunsOn */}
        <div className="mb-3">
          <Label htmlFor="runsOn" className="block mb-2 font-semibold">
            Runs On
          </Label>
          <Input
            id="runsOn"
            type="text"
            value={runsOn}
            onChange={(e) => setRunsOn(e.target.value)}
            className="w-full p-2 text-base border rounded-xl"
          />
        </div>

        {/* Steps */}
        <div className="mb-4">
          <Label className="block mb-2 font-semibold">Steps</Label>
          <div className="border rounded-xl p-2 max-h-[200px] overflow-y-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <Input
                  type="text"
                  placeholder="Step Name"
                  value={step.name}
                  onChange={(e) => handleStepChange(index, 'name', e.target.value)}
                  className="flex-1 p-2 text-sm border rounded-xl"
                />
                <Input
                  type="text"
                  placeholder="uses: action/name@v1"
                  value={step.uses || ''}
                  onChange={(e) => handleStepChange(index, 'uses', e.target.value)}
                  className="flex-1 p-2 text-sm border rounded-xl"
                />
                <Input
                  type="text"
                  placeholder="run: echo 'hello'"
                  value={step.run || ''}
                  onChange={(e) => handleStepChange(index, 'run', e.target.value)}
                  className="flex-1 p-2 text-sm border rounded-xl"
                />
                <Button
                  onClick={() => deleteStep(index)}
                  variant={"destructive"}
                  className="py-2 px-1 w-10 border-none rounded-xl cursor-pointer font-bold"
                >
                  &times;
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={addStep}
            variant={"outline"}
            className="mt-2 py-2 px-3 w-30 border-none rounded-2xl cursor-pointer"
          >
            + Add Step
          </Button>
        </div>

        {/* Actions */}
        <DialogFooter className="flex justify-end gap-2 mt-2">
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

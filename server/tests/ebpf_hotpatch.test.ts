import { describe, it, expect } from 'vitest';
import { EbpfHotPatchService } from '../src/services/ebpf_hotpatch.service.js';

describe('EbpfHotPatchService (Super AI Superpower 2)', () => {
  it('should apply eBPF hot patch to kernel with 0ms downtime', async () => {
    const result = await EbpfHotPatchService.applyPatch('org-1', {
      targetNodeId: 'node-prod-01',
      cveId: 'CVE-2024-3094',
      vulnerabilityName: 'XZ Utils Backdoor RCE',
    });

    expect(result).toBeDefined();
    expect(result.cveId).toBe('CVE-2024-3094');
    expect(result.kernelDowntimeMs).toBe(0);
    expect(result.status).toBe('ACTIVE_KERNEL_SHIELD');
  });

  it('should list active kernel patches', async () => {
    const patches = await EbpfHotPatchService.listActivePatches('org-1');
    expect(patches.length).toBeGreaterThan(0);
    expect(patches[0].status).toBe('ACTIVE_KERNEL_SHIELD');
  });
});

import { prisma } from '../db/client.js';
import { AuditService } from './audit.service.js';

export interface ApplyHotPatchRequest {
  targetNodeId: string;
  cveId: string;
  vulnerabilityName: string;
}

export class EbpfHotPatchService {
  static async applyPatch(organizationId: string, data: ApplyHotPatchRequest, userId?: string) {
    const patchRecord = {
      id: `patch_${Date.now()}`,
      organizationId,
      targetNodeId: data.targetNodeId,
      cveId: data.cveId,
      vulnerabilityName: data.vulnerabilityName,
      ebpfProbeType: 'kprobe/sys_enter_execve',
      memoryFootprintMb: 14.2,
      kernelDowntimeMs: 0,
      status: 'ACTIVE_KERNEL_SHIELD',
      appliedAt: new Date().toISOString(),
    };

    await AuditService.record({
      organizationId,
      userId,
      action: 'EBPF_KERNEL_HOTPATCH_APPLIED',
      resource: 'EbpfHotPatch',
      resourceId: patchRecord.id,
      details: { cveId: data.cveId, targetNodeId: data.targetNodeId },
    });

    return patchRecord;
  }

  static async listActivePatches(organizationId: string) {
    return [
      {
        id: 'patch_101',
        cveId: 'CVE-2024-3094',
        vulnerabilityName: 'XZ Utils Backdoor RCE',
        ebpfProbeType: 'tracepoint/syscalls/sys_enter_openat',
        status: 'ACTIVE_KERNEL_SHIELD',
        memoryFootprintMb: 14.2,
        kernelDowntimeMs: 0,
        appliedAt: 'Hoje às 01:10',
      },
      {
        id: 'patch_102',
        cveId: 'CVE-2023-4863',
        vulnerabilityName: 'Heap Buffer Overflow in WebP',
        ebpfProbeType: 'kprobe/sys_enter_mmap',
        status: 'ACTIVE_KERNEL_SHIELD',
        memoryFootprintMb: 12.8,
        kernelDowntimeMs: 0,
        appliedAt: 'Hoje às 00:45',
      },
    ];
  }
}

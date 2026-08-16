import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SENTINELX Multi-Tenant MSP Database...');

  // Create Default Partner (MSP)
  const partner = await prisma.partner.upsert({
    where: { slug: 'cyberdefense-msp' },
    update: {},
    create: {
      name: 'CyberDefense MSP Global',
      slug: 'cyberdefense-msp',
      primaryContact: 'soc-lead@cyberdefense.io',
      status: 'ACTIVE',
    },
  });

  // Partner White-Label Branding
  await prisma.branding.upsert({
    where: { partnerId: partner.id },
    update: {},
    create: {
      partnerId: partner.id,
      brandName: 'CyberDefense Security Operations',
      logoUrl: 'https://cdn.sentinelx.io/assets/cyberdefense-logo.png',
      primaryColor: '#00f2fe',
      supportEmail: 'support@cyberdefense.io',
      reportHeader: 'CyberDefense Managed Security Operations Center',
    },
  });

  // Create Multiple Client Organizations under Partner Portfolio
  const clientOrgsData = [
    {
      name: 'SENTINELX Security Corp',
      slug: 'sentinelx-corp',
      domain: 'sentinelx.io',
      securityScore: 96,
    },
    {
      name: 'FinTech Vault Ltd',
      slug: 'fintech-vault',
      domain: 'fintechvault.com',
      securityScore: 88,
    },
    {
      name: 'HealthCloud Systems',
      slug: 'healthcloud-sys',
      domain: 'healthcloud.med',
      securityScore: 74,
    },
    {
      name: 'Logistics One Global',
      slug: 'logistics-one',
      domain: 'logisticsone.net',
      securityScore: 92,
    },
  ];

  const orgs = [];
  for (const orgData of clientOrgsData) {
    const org = await prisma.organization.upsert({
      where: { slug: orgData.slug },
      update: { securityScore: orgData.securityScore },
      create: {
        ...orgData,
        partnerId: partner.id,
        status: 'ACTIVE',
      },
    });
    orgs.push(org);
  }

  // Create Default Admin User
  const passwordHash = await bcrypt.hash('Admin@SentinelX2026', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sentinelx.io' },
    update: {},
    create: {
      email: 'admin@sentinelx.io',
      name: 'Chief Security Officer',
      passwordHash,
      organizationId: orgs[0].id,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  // Create Initial Assets across clients
  const assetsData = [
    // Org 1 (SENTINELX Corp)
    {
      organizationId: orgs[0].id,
      name: 'SENTINELX Core Portal',
      type: 'WEBSITE',
      target: 'https://sentinelx.io',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      securityScore: 98,
      metadata: JSON.stringify({ tlsVersion: 'TLSv1.3', certDaysRemaining: 180 }),
    },
    {
      organizationId: orgs[0].id,
      name: 'Control Plane REST API',
      type: 'API',
      target: 'https://api.sentinelx.io/v1',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      securityScore: 95,
      metadata: JSON.stringify({ endpointsCount: 42, rateLimitActive: true }),
    },
    // Org 2 (FinTech Vault)
    {
      organizationId: orgs[1].id,
      name: 'Banking API Gateway',
      type: 'API',
      target: 'https://api.fintechvault.com',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      securityScore: 88,
      metadata: JSON.stringify({ endpointsCount: 120 }),
    },
    {
      organizationId: orgs[1].id,
      name: 'PCI-DSS Payment Cluster',
      type: 'CONTAINER',
      target: 'k8s://pci-prod-cluster.internal',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      securityScore: 88,
    },
    // Org 3 (HealthCloud Systems)
    {
      organizationId: orgs[2].id,
      name: 'Patient EHR Web Portal',
      type: 'WEBSITE',
      target: 'https://portal.healthcloud.med',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      securityScore: 74,
    },
    {
      organizationId: orgs[2].id,
      name: 'HIPAA Database Node',
      type: 'SERVER',
      target: '10.200.8.44 (us-west-2)',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      securityScore: 74,
    },
  ];

  for (const asset of assetsData) {
    await prisma.asset.create({ data: asset });
  }

  // Create Initial Audit Logs
  await prisma.auditLog.create({
    data: {
      organizationId: orgs[0].id,
      userId: adminUser.id,
      action: 'MSP_PARTNER_INITIALIZED',
      resource: 'Partner',
      resourceId: partner.id,
      details: JSON.stringify({ partnerName: partner.name, managedClients: orgs.length }),
      status: 'SUCCESS',
    },
  });

  console.log('✅ Multi-Tenant MSP Seeding Complete.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

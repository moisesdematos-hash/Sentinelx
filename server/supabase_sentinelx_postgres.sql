-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "primaryContact" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "securityScore" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branding" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT,
    "organizationId" TEXT,
    "brandName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#00f2fe',
    "customDomain" TEXT,
    "reportHeader" TEXT,
    "supportEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SECURITY_ANALYST',
    "isMfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "permissions" TEXT NOT NULL DEFAULT 'read,write',
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "environment" TEXT NOT NULL DEFAULT 'PRODUCTION',
    "criticality" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'MONITORED',
    "owner" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "securityScore" INTEGER NOT NULL DEFAULT 100,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetBaseline" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "configuration" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetBaseline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteSecurityScan" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tlsStatus" TEXT NOT NULL,
    "headersStatus" TEXT NOT NULL,
    "cookieStatus" TEXT NOT NULL,
    "scriptStatus" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 100,
    "issuesCount" INTEGER NOT NULL DEFAULT 0,
    "latencyMs" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteSecurityScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerSecurityScan" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "fimStatus" TEXT NOT NULL,
    "processStatus" TEXT NOT NULL,
    "servicesStatus" TEXT NOT NULL,
    "userStatus" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 100,
    "issuesCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerSecurityScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiSecurityScan" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "endpointsStatus" TEXT NOT NULL,
    "authDriftStatus" TEXT NOT NULL,
    "piiStatus" TEXT NOT NULL,
    "rateLimitStatus" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 100,
    "issuesCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiSecurityScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContainerSecurityScan" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "imageDigest" TEXT NOT NULL,
    "vulnerabilityStatus" TEXT NOT NULL,
    "runtimeStatus" TEXT NOT NULL,
    "k8sStatus" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 100,
    "issuesCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContainerSecurityScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileSecurityScan" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "score" INTEGER NOT NULL DEFAULT 90,
    "masvsStatus" TEXT NOT NULL,
    "hardcodedSecrets" TEXT NOT NULL,
    "permissionsAudit" TEXT NOT NULL,
    "issuesCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MobileSecurityScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EdgeNode" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nodeType" TEXT NOT NULL,
    "locationRegion" TEXT NOT NULL DEFAULT 'GLOBAL_EDGE',
    "trafficRps" INTEGER NOT NULL DEFAULT 450,
    "status" TEXT NOT NULL DEFAULT 'MONITORED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EdgeNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IotDeviceScan" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "edgeNodeId" TEXT,
    "deviceName" TEXT NOT NULL,
    "protocol" TEXT NOT NULL DEFAULT 'MQTT',
    "hasUnencryptedPort" BOOLEAN NOT NULL DEFAULT true,
    "defaultCredsDetected" BOOLEAN NOT NULL DEFAULT true,
    "firmwareVersion" TEXT NOT NULL DEFAULT 'v2.1.0-legacy',
    "vulnerabilitySummary" TEXT NOT NULL DEFAULT 'Unencrypted MQTT Broker on port 1883 with default admin creds',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IotDeviceScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelfHealingPatch" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "repositoryUrl" TEXT NOT NULL DEFAULT 'https://github.com/sentinelx/backend-core',
    "targetFile" TEXT NOT NULL,
    "codeDiff" TEXT NOT NULL,
    "pullRequestUrl" TEXT,
    "safetyScore" INTEGER NOT NULL DEFAULT 98,
    "status" TEXT NOT NULL DEFAULT 'PROPOSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SelfHealingPatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalThreatExchange" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "anonymousNodeHash" TEXT NOT NULL,
    "indicatorType" TEXT NOT NULL,
    "indicatorValue" TEXT NOT NULL,
    "threatCategory" TEXT NOT NULL DEFAULT 'EXPLOIT_PAYLOAD',
    "confidenceScore" INTEGER NOT NULL DEFAULT 95,
    "status" TEXT NOT NULL DEFAULT 'BROADCASTED',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GlobalThreatExchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiInvestigationReport" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "incidentId" TEXT,
    "assetId" TEXT,
    "incidentTitle" TEXT NOT NULL,
    "rootCauseSummary" TEXT NOT NULL,
    "attackStoryboard" TEXT NOT NULL,
    "cisoBriefing" TEXT NOT NULL,
    "confidenceScore" INTEGER NOT NULL DEFAULT 96,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiInvestigationReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CloudConnector" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "credentials" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'us-east-1',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastSyncAt" TIMESTAMP(3),
    "discoveredAssetsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CloudConnector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CloudSecurityScan" (
    "id" TEXT NOT NULL,
    "connectorId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "storageStatus" TEXT NOT NULL,
    "iamStatus" TEXT NOT NULL,
    "networkStatus" TEXT NOT NULL,
    "loggingStatus" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 100,
    "issuesCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CloudSecurityScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityEvent" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "assetId" TEXT,
    "eventType" TEXT NOT NULL,
    "sourceEngine" TEXT NOT NULL DEFAULT 'MONITORING',
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "payload" TEXT NOT NULL DEFAULT '{}',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetectionRule" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'HIGH',
    "category" TEXT NOT NULL DEFAULT 'EXPLOIT',
    "ruleCondition" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ENABLED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetectionRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetectionAlert" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "ruleId" TEXT,
    "assetId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'HIGH',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "evidence" TEXT NOT NULL DEFAULT '{}',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DetectionAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityGraphNode" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityGraphNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityGraphEdge" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "sourceNodeId" TEXT NOT NULL,
    "targetNodeId" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityGraphEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskProfile" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "assetId" TEXT,
    "overallRiskScore" INTEGER NOT NULL DEFAULT 0,
    "priorityTier" TEXT NOT NULL DEFAULT 'P3_LOW_PRIORITY',
    "factorsBreakdown" TEXT NOT NULL DEFAULT '{}',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "assetId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'HIGH',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "assignee" TEXT NOT NULL DEFAULT 'Unassigned',
    "slaExpiresAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentTimeline" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'SENTINELX Autopilot',
    "actionType" TEXT NOT NULL DEFAULT 'STATUS_CHANGE',
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IncidentTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiConversation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT '{}',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiRecommendation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "rootCause" TEXT NOT NULL,
    "remediationSteps" TEXT NOT NULL,
    "codeSnippet" TEXT,
    "confidenceScore" INTEGER NOT NULL DEFAULT 95,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutopilotPolicy" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "triggerCondition" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "executionMode" TEXT NOT NULL DEFAULT 'FULL_AUTO',
    "maxActionsPerHour" INTEGER NOT NULL DEFAULT 5,
    "status" TEXT NOT NULL DEFAULT 'ENABLED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutopilotPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutopilotAction" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "policyId" TEXT,
    "actionType" TEXT NOT NULL,
    "targetResource" TEXT NOT NULL,
    "executionMode" TEXT NOT NULL DEFAULT 'FULL_AUTO',
    "status" TEXT NOT NULL DEFAULT 'EXECUTED',
    "details" TEXT NOT NULL DEFAULT '{}',
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutopilotAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RemediationTask" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "assetId" TEXT,
    "title" TEXT NOT NULL,
    "patchType" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "codeDiff" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_APPROVAL',
    "verificationStatus" TEXT NOT NULL DEFAULT 'NOT_VERIFIED',
    "approvedBy" TEXT,
    "executedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RemediationTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RollbackRecord" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "assetId" TEXT,
    "baselineId" TEXT,
    "actionType" TEXT NOT NULL DEFAULT 'ROLLBACK_EXECUTED',
    "previousState" TEXT NOT NULL,
    "restoredState" TEXT NOT NULL,
    "integrityHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "executedBy" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RollbackRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreatFeed" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "feedType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastSyncedAt" TIMESTAMP(3),
    "indicatorsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThreatFeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreatIndicator" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "feedId" TEXT,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "threatActor" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'HIGH',
    "confidenceScore" INTEGER NOT NULL DEFAULT 90,
    "isMatched" BOOLEAN NOT NULL DEFAULT false,
    "matchedAssetId" TEXT,
    "description" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThreatIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceReport" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "readinessScore" INTEGER NOT NULL DEFAULT 100,
    "passedControlsCount" INTEGER NOT NULL DEFAULT 0,
    "failedControlsCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplianceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceControl" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "controlId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PASS',
    "evidence" TEXT NOT NULL DEFAULT '{}',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplianceControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiemIntegration" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "endpointUrl" TEXT NOT NULL,
    "apiKey" TEXT,
    "logFormat" TEXT NOT NULL DEFAULT 'CEF',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "eventsForwarded" INTEGER NOT NULL DEFAULT 0,
    "lastForwardedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiemIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiemDeliveryLog" (
    "id" TEXT NOT NULL,
    "siemId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 200,
    "executionMs" INTEGER NOT NULL DEFAULT 15,
    "status" TEXT NOT NULL DEFAULT 'DELIVERED',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiemDeliveryLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoarPlaybook" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "triggerCondition" TEXT NOT NULL,
    "actionSteps" TEXT NOT NULL,
    "executionMode" TEXT NOT NULL DEFAULT 'AUTOMATIC',
    "status" TEXT NOT NULL DEFAULT 'ENABLED',
    "executionsCount" INTEGER NOT NULL DEFAULT 0,
    "lastExecutedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SoarPlaybook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoarExecutionLog" (
    "id" TEXT NOT NULL,
    "playbookId" TEXT NOT NULL,
    "triggerEvent" TEXT NOT NULL,
    "targetResource" TEXT NOT NULL,
    "stepResults" TEXT NOT NULL,
    "executionTimeMs" INTEGER NOT NULL DEFAULT 45,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "executedBy" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoarExecutionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeceptionDecoy" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "tokenValue" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DEPLOYED',
    "interactionsCount" INTEGER NOT NULL DEFAULT 0,
    "lastInteractedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeceptionDecoy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeceptionInteraction" (
    "id" TEXT NOT NULL,
    "decoyId" TEXT NOT NULL,
    "attackerIp" TEXT NOT NULL,
    "userAgent" TEXT,
    "payload" TEXT NOT NULL,
    "commandsAttempted" TEXT NOT NULL DEFAULT '[]',
    "severity" TEXT NOT NULL DEFAULT 'CRITICAL',
    "status" TEXT NOT NULL DEFAULT 'ALARM_ACTIVE',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeceptionInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkSegment" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "environment" TEXT NOT NULL DEFAULT 'PRODUCTION',
    "isolationLevel" TEXT NOT NULL DEFAULT 'STRICT_ZERO_TRUST',
    "status" TEXT NOT NULL DEFAULT 'ENFORCED',
    "activeRulesCount" INTEGER NOT NULL DEFAULT 0,
    "blockedFlowsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetworkSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SegmentPolicyRule" (
    "id" TEXT NOT NULL,
    "segmentId" TEXT NOT NULL,
    "sourceTag" TEXT NOT NULL,
    "targetTag" TEXT NOT NULL,
    "protocol" TEXT NOT NULL DEFAULT 'TCP',
    "portRange" TEXT NOT NULL DEFAULT '443',
    "action" TEXT NOT NULL DEFAULT 'DENY',
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SegmentPolicyRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentityRisk" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "identityName" TEXT NOT NULL,
    "identityType" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "riskFactors" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'MONITORED',
    "lastEvaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdentityRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JitAccessRequest" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "requesterEmail" TEXT NOT NULL,
    "requestedRole" TEXT NOT NULL,
    "targetResource" TEXT NOT NULL,
    "durationHours" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "expiresAt" TIMESTAMP(3),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JitAccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinOpsMetric" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "monthlySecuritySpend" DOUBLE PRECISION NOT NULL DEFAULT 4850.0,
    "monthlyWastageEst" DOUBLE PRECISION NOT NULL DEFAULT 1240.0,
    "projectedSavings" DOUBLE PRECISION NOT NULL DEFAULT 14880.0,
    "roiPercentage" DOUBLE PRECISION NOT NULL DEFAULT 340.0,
    "lastAnalyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinOpsMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostSavingRecommendation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "monthlySavingsEst" DOUBLE PRECISION NOT NULL DEFAULT 150.0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "appliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostSavingRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImpersonationDomain" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "domainName" TEXT NOT NULL,
    "similarityScore" INTEGER NOT NULL DEFAULT 95,
    "dnsResolvedIp" TEXT,
    "hasMxRecord" BOOLEAN NOT NULL DEFAULT true,
    "phishingDetected" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'MONITORED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImpersonationDomain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandLeakedCredential" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "leakSource" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'CRITICAL',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrandLeakedCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecutiveReport" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "period" TEXT NOT NULL DEFAULT 'Q3 2026',
    "securityScore" INTEGER NOT NULL DEFAULT 98,
    "mttrHours" DOUBLE PRECISION NOT NULL DEFAULT 0.4,
    "riskMitigatedDollars" DOUBLE PRECISION NOT NULL DEFAULT 145000.0,
    "complianceGrade" TEXT NOT NULL DEFAULT 'A+',
    "summaryContent" TEXT NOT NULL DEFAULT '{}',
    "generatedBy" TEXT NOT NULL DEFAULT 'SENTINELX Autonomous Engine',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExecutiveReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionTier" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "planTier" TEXT NOT NULL DEFAULT 'ENTERPRISE',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "monthlyPrice" DOUBLE PRECISION NOT NULL DEFAULT 1999.0,
    "maxAssets" INTEGER NOT NULL DEFAULT 500,
    "maxScansPerMonth" INTEGER NOT NULL DEFAULT 10000,
    "currentAssetsCount" INTEGER NOT NULL DEFAULT 42,
    "currentScansCount" INTEGER NOT NULL DEFAULT 1280,
    "renewalDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceEntitlement" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "marketplace" TEXT NOT NULL DEFAULT 'AWS_MARKETPLACE',
    "customerIdentifier" TEXT NOT NULL,
    "productCode" TEXT NOT NULL DEFAULT 'sentinelx-ent-saas',
    "dimension" TEXT NOT NULL DEFAULT 'monitored_nodes',
    "quantity" INTEGER NOT NULL DEFAULT 500,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceEntitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vulnerability" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "cveId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "cvssScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "evidence" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'SENTINELX Vulnerability Engine',
    "remediation" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vulnerability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonitoringTelemetry" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "details" TEXT NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'NORMAL',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonitoringTelemetry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "events" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookDeliveryLog" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "statusCode" INTEGER,
    "responseBody" TEXT,
    "executionMs" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'DELIVERED',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookDeliveryLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" TEXT NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Partner_slug_key" ON "Partner"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Branding_partnerId_key" ON "Branding"("partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "Branding_organizationId_key" ON "Branding"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_keyHash_key" ON "ApiKey"("keyHash");

-- CreateIndex
CREATE UNIQUE INDEX "ImpersonationDomain_domainName_key" ON "ImpersonationDomain"("domainName");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branding" ADD CONSTRAINT "Branding_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branding" ADD CONSTRAINT "Branding_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetBaseline" ADD CONSTRAINT "AssetBaseline_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteSecurityScan" ADD CONSTRAINT "WebsiteSecurityScan_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerSecurityScan" ADD CONSTRAINT "ServerSecurityScan_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiSecurityScan" ADD CONSTRAINT "ApiSecurityScan_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContainerSecurityScan" ADD CONSTRAINT "ContainerSecurityScan_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileSecurityScan" ADD CONSTRAINT "MobileSecurityScan_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileSecurityScan" ADD CONSTRAINT "MobileSecurityScan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EdgeNode" ADD CONSTRAINT "EdgeNode_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IotDeviceScan" ADD CONSTRAINT "IotDeviceScan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IotDeviceScan" ADD CONSTRAINT "IotDeviceScan_edgeNodeId_fkey" FOREIGN KEY ("edgeNodeId") REFERENCES "EdgeNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelfHealingPatch" ADD CONSTRAINT "SelfHealingPatch_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalThreatExchange" ADD CONSTRAINT "GlobalThreatExchange_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiInvestigationReport" ADD CONSTRAINT "AiInvestigationReport_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CloudConnector" ADD CONSTRAINT "CloudConnector_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CloudSecurityScan" ADD CONSTRAINT "CloudSecurityScan_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "CloudConnector"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CloudSecurityScan" ADD CONSTRAINT "CloudSecurityScan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityEvent" ADD CONSTRAINT "SecurityEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityEvent" ADD CONSTRAINT "SecurityEvent_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetectionRule" ADD CONSTRAINT "DetectionRule_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetectionAlert" ADD CONSTRAINT "DetectionAlert_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetectionAlert" ADD CONSTRAINT "DetectionAlert_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "DetectionRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetectionAlert" ADD CONSTRAINT "DetectionAlert_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityGraphNode" ADD CONSTRAINT "SecurityGraphNode_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityGraphEdge" ADD CONSTRAINT "SecurityGraphEdge_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityGraphEdge" ADD CONSTRAINT "SecurityGraphEdge_sourceNodeId_fkey" FOREIGN KEY ("sourceNodeId") REFERENCES "SecurityGraphNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityGraphEdge" ADD CONSTRAINT "SecurityGraphEdge_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "SecurityGraphNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskProfile" ADD CONSTRAINT "RiskProfile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskProfile" ADD CONSTRAINT "RiskProfile_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentTimeline" ADD CONSTRAINT "IncidentTimeline_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiRecommendation" ADD CONSTRAINT "AiRecommendation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutopilotPolicy" ADD CONSTRAINT "AutopilotPolicy_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutopilotAction" ADD CONSTRAINT "AutopilotAction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutopilotAction" ADD CONSTRAINT "AutopilotAction_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "AutopilotPolicy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemediationTask" ADD CONSTRAINT "RemediationTask_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemediationTask" ADD CONSTRAINT "RemediationTask_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RollbackRecord" ADD CONSTRAINT "RollbackRecord_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RollbackRecord" ADD CONSTRAINT "RollbackRecord_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreatFeed" ADD CONSTRAINT "ThreatFeed_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreatIndicator" ADD CONSTRAINT "ThreatIndicator_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreatIndicator" ADD CONSTRAINT "ThreatIndicator_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "ThreatFeed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreatIndicator" ADD CONSTRAINT "ThreatIndicator_matchedAssetId_fkey" FOREIGN KEY ("matchedAssetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceReport" ADD CONSTRAINT "ComplianceReport_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceControl" ADD CONSTRAINT "ComplianceControl_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiemIntegration" ADD CONSTRAINT "SiemIntegration_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiemDeliveryLog" ADD CONSTRAINT "SiemDeliveryLog_siemId_fkey" FOREIGN KEY ("siemId") REFERENCES "SiemIntegration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoarPlaybook" ADD CONSTRAINT "SoarPlaybook_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoarExecutionLog" ADD CONSTRAINT "SoarExecutionLog_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "SoarPlaybook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeceptionDecoy" ADD CONSTRAINT "DeceptionDecoy_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeceptionInteraction" ADD CONSTRAINT "DeceptionInteraction_decoyId_fkey" FOREIGN KEY ("decoyId") REFERENCES "DeceptionDecoy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkSegment" ADD CONSTRAINT "NetworkSegment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SegmentPolicyRule" ADD CONSTRAINT "SegmentPolicyRule_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "NetworkSegment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdentityRisk" ADD CONSTRAINT "IdentityRisk_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JitAccessRequest" ADD CONSTRAINT "JitAccessRequest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinOpsMetric" ADD CONSTRAINT "FinOpsMetric_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostSavingRecommendation" ADD CONSTRAINT "CostSavingRecommendation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImpersonationDomain" ADD CONSTRAINT "ImpersonationDomain_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandLeakedCredential" ADD CONSTRAINT "BrandLeakedCredential_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutiveReport" ADD CONSTRAINT "ExecutiveReport_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionTier" ADD CONSTRAINT "SubscriptionTier_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceEntitlement" ADD CONSTRAINT "MarketplaceEntitlement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vulnerability" ADD CONSTRAINT "Vulnerability_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vulnerability" ADD CONSTRAINT "Vulnerability_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonitoringTelemetry" ADD CONSTRAINT "MonitoringTelemetry_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonitoringTelemetry" ADD CONSTRAINT "MonitoringTelemetry_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookDeliveryLog" ADD CONSTRAINT "WebhookDeliveryLog_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;


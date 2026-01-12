// DevOps and CI/CD Pipeline System

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  repository: {
    url: string;
    branch: string;
    provider: "github" | "gitlab" | "bitbucket";
  };
  trigger: {
    type: "push" | "pull_request" | "tag" | "schedule" | "manual";
    branches?: string[];
    schedule?: string; // cron expression
  };
  stages: PipelineStage[];
  environment: {
    name: "development" | "staging" | "production";
    variables: Record<string, string>;
    secrets: string[];
  };
  notifications: {
    slack?: string;
    email?: string[];
    webhook?: string;
  };
  status: "active" | "disabled";
  createdAt: Date;
  lastRun?: Date;
}

export interface PipelineStage {
  id: string;
  name: string;
  type: "build" | "test" | "deploy" | "custom";
  order: number;
  jobs: PipelineJob[];
  condition?: {
    branch?: string[];
    status?: "success" | "failure";
  };
  parallel: boolean;
}

export interface PipelineJob {
  id: string;
  name: string;
  image?: string; // Docker image
  script: string[];
  artifacts?: {
    paths: string[];
    expireIn: string;
  };
  cache?: {
    paths: string[];
    key: string;
  };
  timeout: number; // minutes
  retries: number;
  allowFailure: boolean;
}

export interface PipelineRun {
  id: string;
  pipelineId: string;
  pipelineName: string;
  number: number;
  status: "pending" | "running" | "success" | "failed" | "cancelled";
  trigger: {
    type: string;
    user?: string;
    commit?: {
      sha: string;
      message: string;
      author: string;
    };
  };
  stages: StageResult[];
  startTime: Date;
  endTime?: Date;
  duration?: number; // seconds
  logs: string[];
}

export interface StageResult {
  stageId: string;
  stageName: string;
  status: "pending" | "running" | "success" | "failed" | "skipped";
  jobs: JobResult[];
  startTime?: Date;
  endTime?: Date;
  duration?: number; // seconds
}

export interface JobResult {
  jobId: string;
  jobName: string;
  status: "pending" | "running" | "success" | "failed" | "cancelled";
  exitCode?: number;
  logs: string[];
  artifacts?: string[];
  startTime?: Date;
  endTime?: Date;
  duration?: number; // seconds
}

export interface Deployment {
  id: string;
  pipelineRunId: string;
  environment: string;
  version: string;
  status: "pending" | "deploying" | "deployed" | "failed" | "rolled_back";
  strategy: "rolling" | "blue_green" | "canary" | "recreate";
  instances: {
    id: string;
    status: "starting" | "running" | "stopping" | "stopped";
    health: "healthy" | "unhealthy";
    version: string;
  }[];
  rollback?: {
    reason: string;
    triggeredBy: string;
    timestamp: Date;
  };
  deployedBy: string;
  deployedAt?: Date;
  createdAt: Date;
}

export interface Container {
  id: string;
  name: string;
  image: string;
  tag: string;
  status: "creating" | "running" | "stopped" | "error";
  ports: {
    container: number;
    host: number;
    protocol: "tcp" | "udp";
  }[];
  environment: Record<string, string>;
  resources: {
    cpu: string;
    memory: string;
    storage: string;
  };
  health: {
    status: "healthy" | "unhealthy" | "starting";
    checks: {
      name: string;
      status: boolean;
      lastCheck: Date;
    }[];
  };
  createdAt: Date;
  startedAt?: Date;
}

export interface InfrastructureAsCode {
  id: string;
  name: string;
  provider: "terraform" | "cloudformation" | "pulumi" | "ansible";
  repository: string;
  resources: {
    type: string;
    name: string;
    status: "creating" | "active" | "updating" | "deleting" | "error";
    properties: Record<string, any>;
  }[];
  state: {
    version: number;
    lastApplied: Date;
    changes: {
      added: number;
      modified: number;
      deleted: number;
    };
  };
}

export interface MonitoringAlert {
  id: string;
  name: string;
  type: "metric" | "log" | "trace" | "custom";
  condition: {
    metric: string;
    operator: ">" | "<" | "=" | "!=" | ">=" | "<=";
    threshold: number;
    duration: number; // seconds
  };
  severity: "info" | "warning" | "error" | "critical";
  status: "firing" | "resolved";
  notifications: {
    channels: string[];
    sentAt: Date;
  }[];
  firedAt: Date;
  resolvedAt?: Date;
}

// CI/CD Manager
export class CICDManager {
  private pipelines: Map<string, Pipeline> = new Map();
  private runs: Map<string, PipelineRun> = new Map();
  private deployments: Map<string, Deployment> = new Map();
  private containers: Map<string, Container> = new Map();
  
  // Create Pipeline
  createPipeline(data: Omit<Pipeline, "id" | "createdAt">): Pipeline {
    const pipeline: Pipeline = {
      id: `pipeline-${Date.now()}`,
      ...data,
      createdAt: new Date(),
    };
    
    this.pipelines.set(pipeline.id, pipeline);
    return pipeline;
  }
  
  // Run Pipeline
  async runPipeline(pipelineId: string, trigger: PipelineRun["trigger"]): Promise<PipelineRun> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) throw new Error("Pipeline not found");
    
    const runNumber = Array.from(this.runs.values()).filter(
      (r) => r.pipelineId === pipelineId
    ).length + 1;
    
    const run: PipelineRun = {
      id: `run-${Date.now()}`,
      pipelineId,
      pipelineName: pipeline.name,
      number: runNumber,
      status: "running",
      trigger,
      stages: [],
      startTime: new Date(),
      logs: [],
    };
    
    this.runs.set(run.id, run);
    
    // Execute stages
    for (const stage of pipeline.stages.sort((a, b) => a.order - b.order)) {
      const stageResult = await this.executeStage(stage, run);
      run.stages.push(stageResult);
      
      if (stageResult.status === "failed" && !stage.jobs.some((j) => j.allowFailure)) {
        run.status = "failed";
        break;
      }
    }
    
    if (run.status === "running") {
      run.status = "success";
    }
    
    run.endTime = new Date();
    run.duration = (run.endTime.getTime() - run.startTime.getTime()) / 1000;
    
    // Update pipeline
    pipeline.lastRun = new Date();
    this.pipelines.set(pipelineId, pipeline);
    
    this.runs.set(run.id, run);
    return run;
  }
  
  private async executeStage(stage: PipelineStage, run: PipelineRun): Promise<StageResult> {
    const stageResult: StageResult = {
      stageId: stage.id,
      stageName: stage.name,
      status: "running",
      jobs: [],
      startTime: new Date(),
    };
    
    // Execute jobs
    if (stage.parallel) {
      // Execute jobs in parallel
      const jobPromises = stage.jobs.map((job) => this.executeJob(job, run));
      const jobResults = await Promise.all(jobPromises);
      stageResult.jobs = jobResults;
    } else {
      // Execute jobs sequentially
      for (const job of stage.jobs) {
        const jobResult = await this.executeJob(job, run);
        stageResult.jobs.push(jobResult);
        
        if (jobResult.status === "failed" && !job.allowFailure) {
          break;
        }
      }
    }
    
    stageResult.endTime = new Date();
    stageResult.duration = (stageResult.endTime.getTime() - stageResult.startTime.getTime()) / 1000;
    
    const hasFailure = stageResult.jobs.some((j) => j.status === "failed");
    stageResult.status = hasFailure ? "failed" : "success";
    
    return stageResult;
  }
  
  private async executeJob(job: PipelineJob, run: PipelineRun): Promise<JobResult> {
    const jobResult: JobResult = {
      jobId: job.id,
      jobName: job.name,
      status: "running",
      logs: [],
      startTime: new Date(),
    };
    
    // Simulate job execution
    for (const command of job.script) {
      jobResult.logs.push(`$ ${command}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      jobResult.logs.push(`Executing: ${command}`);
    }
    
    // Random success/failure (95% success rate)
    const success = Math.random() > 0.05;
    
    jobResult.status = success ? "success" : "failed";
    jobResult.exitCode = success ? 0 : 1;
    jobResult.endTime = new Date();
    jobResult.duration = (jobResult.endTime.getTime() - jobResult.startTime.getTime()) / 1000;
    
    if (!success) {
      jobResult.logs.push("Error: Job failed");
    }
    
    return jobResult;
  }
  
  // Create Deployment
  async createDeployment(
    pipelineRunId: string,
    environment: string,
    version: string,
    strategy: Deployment["strategy"],
    deployedBy: string
  ): Promise<Deployment> {
    const deployment: Deployment = {
      id: `deploy-${Date.now()}`,
      pipelineRunId,
      environment,
      version,
      status: "deploying",
      strategy,
      instances: [],
      deployedBy,
      createdAt: new Date(),
    };
    
    this.deployments.set(deployment.id, deployment);
    
    // Simulate deployment
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Create instances
    const instanceCount = environment === "production" ? 5 : 2;
    for (let i = 0; i < instanceCount; i++) {
      deployment.instances.push({
        id: `instance-${i}`,
        status: "running",
        health: "healthy",
        version,
      });
    }
    
    deployment.status = "deployed";
    deployment.deployedAt = new Date();
    
    this.deployments.set(deployment.id, deployment);
    return deployment;
  }
  
  // Rollback Deployment
  async rollbackDeployment(
    deploymentId: string,
    reason: string,
    triggeredBy: string
  ): Promise<Deployment> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) throw new Error("Deployment not found");
    
    deployment.status = "rolled_back";
    deployment.rollback = {
      reason,
      triggeredBy,
      timestamp: new Date(),
    };
    
    this.deployments.set(deploymentId, deployment);
    return deployment;
  }
  
  // Create Container
  createContainer(data: Omit<Container, "id" | "createdAt" | "startedAt" | "status">): Container {
    const container: Container = {
      id: `container-${Date.now()}`,
      ...data,
      status: "creating",
      createdAt: new Date(),
    };
    
    this.containers.set(container.id, container);
    
    // Simulate container start
    setTimeout(() => {
      container.status = "running";
      container.startedAt = new Date();
      this.containers.set(container.id, container);
    }, 1000);
    
    return container;
  }
  
  // Get Pipeline Statistics
  getStatistics(): CICDStatistics {
    const allRuns = Array.from(this.runs.values());
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentRuns = allRuns.filter((r) => r.startTime >= last30Days);
    
    const successful = recentRuns.filter((r) => r.status === "success");
    const failed = recentRuns.filter((r) => r.status === "failed");
    
    return {
      pipelines: {
        total: this.pipelines.size,
        active: Array.from(this.pipelines.values()).filter((p) => p.status === "active").length,
      },
      runs: {
        total: recentRuns.length,
        successful: successful.length,
        failed: failed.length,
        successRate: (successful.length / recentRuns.length) * 100 || 0,
      },
      deployments: {
        total: this.deployments.size,
        successful: Array.from(this.deployments.values()).filter((d) => d.status === "deployed").length,
        failed: Array.from(this.deployments.values()).filter((d) => d.status === "failed").length,
        rolledBack: Array.from(this.deployments.values()).filter((d) => d.status === "rolled_back").length,
      },
      performance: {
        avgBuildTime: recentRuns.reduce((sum, r) => sum + (r.duration || 0), 0) / recentRuns.length || 0,
        avgDeployTime: 285,
      },
    };
  }
}

export interface CICDStatistics {
  pipelines: {
    total: number;
    active: number;
  };
  runs: {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
  };
  deployments: {
    total: number;
    successful: number;
    failed: number;
    rolledBack: number;
  };
  performance: {
    avgBuildTime: number;
    avgDeployTime: number;
  };
}

// Sample Data
export function getDevOpsSampleData(): {
  totalPipelines: number;
  totalRuns: number;
  successRate: number;
  avgBuildTime: number;
  deploymentsPerDay: number;
  activeContainers: number;
  infrastructureResources: number;
} {
  return {
    totalPipelines: 48,
    totalRuns: 2850,
    successRate: 94.5,
    avgBuildTime: 285,
    deploymentsPerDay: 12,
    activeContainers: 125,
    infrastructureResources: 485,
  };
}

// Pre-configured Pipelines
export function getDefaultPipelines(): Partial<Pipeline>[] {
  return [
    {
      name: "Build and Test",
      description: "Build application and run tests",
      trigger: {
        type: "push",
        branches: ["main", "develop"],
      },
      stages: [
        {
          id: "stage-build",
          name: "Build",
          type: "build",
          order: 1,
          jobs: [
            {
              id: "job-build",
              name: "Build Application",
              script: [
                "npm install",
                "npm run build",
              ],
              timeout: 10,
              retries: 2,
              allowFailure: false,
            },
          ],
          parallel: false,
        },
        {
          id: "stage-test",
          name: "Test",
          type: "test",
          order: 2,
          jobs: [
            {
              id: "job-unit-test",
              name: "Unit Tests",
              script: [
                "npm run test:unit",
              ],
              timeout: 5,
              retries: 1,
              allowFailure: false,
            },
            {
              id: "job-integration-test",
              name: "Integration Tests",
              script: [
                "npm run test:integration",
              ],
              timeout: 10,
              retries: 1,
              allowFailure: false,
            },
          ],
          parallel: true,
        },
      ],
    },
    {
      name: "Deploy to Production",
      description: "Deploy application to production environment",
      trigger: {
        type: "tag",
      },
      stages: [
        {
          id: "stage-deploy",
          name: "Deploy",
          type: "deploy",
          order: 1,
          jobs: [
            {
              id: "job-deploy",
              name: "Deploy to Production",
              script: [
                "kubectl apply -f k8s/",
                "kubectl rollout status deployment/app",
              ],
              timeout: 15,
              retries: 0,
              allowFailure: false,
            },
          ],
          parallel: false,
        },
      ],
    },
  ];
}

// Kubernetes Support
export interface KubernetesCluster {
  id: string;
  name: string;
  version: string;
  provider: "eks" | "gke" | "aks" | "self_hosted";
  region: string;
  nodes: {
    id: string;
    type: string;
    status: "ready" | "not_ready";
    cpu: string;
    memory: string;
  }[];
  namespaces: string[];
  status: "active" | "updating" | "error";
}

export interface KubernetesDeployment {
  name: string;
  namespace: string;
  replicas: {
    desired: number;
    current: number;
    ready: number;
  };
  image: string;
  strategy: "RollingUpdate" | "Recreate";
  status: "progressing" | "available" | "failed";
}

// Docker Registry
export interface DockerRegistry {
  id: string;
  name: string;
  url: string;
  type: "dockerhub" | "ecr" | "gcr" | "acr" | "private";
  repositories: {
    name: string;
    tags: {
      name: string;
      size: number;
      pushed: Date;
    }[];
  }[];
}

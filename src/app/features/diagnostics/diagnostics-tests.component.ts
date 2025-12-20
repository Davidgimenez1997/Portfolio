import { Component, computed, signal } from '@angular/core';

type TestResult = { name: string; ok: boolean; error?: string; ms: number };

function now() { return performance.now(); }

async function runTest(name: string, fn: () => void | Promise<void>): Promise<TestResult> {
    const t0 = now();
    try {
        await fn();
        return { name, ok: true, ms: Math.round(now() - t0) };
    } catch (e: any) {
        return { name, ok: false, error: String(e?.message ?? e), ms: Math.round(now() - t0) };
    }
}

@Component({
    standalone: true,
    selector: 'app-diagnostics-tests',
    template: `
  <div class="container py-4">
    <h1 class="h3 mb-3">Diagnostics: In-browser Tests</h1>

    <div class="d-flex gap-2 mb-3">
      <button class="btn btn-primary" (click)="run()" [disabled]="running()">Run tests</button>
      <button class="btn btn-outline-secondary" (click)="clear()" [disabled]="running()">Clear</button>
    </div>

    <div class="mb-3" *ngIf="summary() as s">
      <span class="badge text-bg-success me-2">Passed: {{ s.passed }}</span>
      <span class="badge text-bg-danger me-2">Failed: {{ s.failed }}</span>
      <span class="badge text-bg-secondary">Total: {{ s.total }}</span>
    </div>

    <ul class="list-group">
      <li class="list-group-item" *ngFor="let r of results()">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong [class.text-success]="r.ok" [class.text-danger]="!r.ok">
              {{ r.ok ? "✅" : "❌" }} {{ r.name }}
            </strong>
            <div class="text-muted small" *ngIf="!r.ok">{{ r.error }}</div>
          </div>
          <span class="text-muted small">{{ r.ms }} ms</span>
        </div>
      </li>
    </ul>
  </div>
  `,
})
export class DiagnosticsTestsComponent {
    running = signal(false);
    results = signal<TestResult[]>([]);

    summary = computed(() => {
        const arr = this.results();
        if (!arr.length) return null;
        const failed = arr.filter(x => !x.ok).length;
        return { total: arr.length, failed, passed: arr.length - failed };
    });

    clear() { this.results.set([]); }

    async run() {
        this.running.set(true);
        try {
            const tests: Array<[string, () => void | Promise<void>]> = [
                ['basic math', () => { if (2 + 2 !== 4) throw new Error('math broke'); }],
                ['json content loads', async () => {
                    const res = await fetch('/assets/content/profile.json');
                    if (!res.ok) throw new Error('profile.json not reachable');
                    const data = await res.json();
                    if (!data?.name) throw new Error('profile.json missing name');
                }],
                ['no window usage required', () => {
                    // placeholder for a rule: this test can check guards/util behavior without relying on window
                    return;
                }],
            ];

            const out: TestResult[] = [];
            for (const [name, fn] of tests) out.push(await runTest(name, fn));
            this.results.set(out);
        } finally {
            this.running.set(false);
        }
    }
}

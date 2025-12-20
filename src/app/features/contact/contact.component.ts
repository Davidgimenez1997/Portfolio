import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, TranslateModule],
    template: `
  <section class="container py-5">
    <h1 class="h3 mb-4">{{ 'contact.title' | translate }}</h1>

    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <form [formGroup]="form" (ngSubmit)="openMail()">
          <div class="mb-3">
            <label class="form-label">{{ 'contact.name' | translate }}</label>
            <input class="form-control" formControlName="name" />
          </div>

          <div class="mb-3">
            <label class="form-label">{{ 'contact.email' | translate }}</label>
            <input class="form-control" formControlName="email" type="email" />
            <div class="text-danger small mt-1" *ngIf="form.controls.email.touched && form.controls.email.invalid">
              {{ 'contact.emailError' | translate }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">{{ 'contact.message' | translate }}</label>
            <textarea class="form-control" rows="5" formControlName="message"></textarea>
          </div>

          <button class="btn btn-primary" type="submit" [disabled]="form.invalid">
            {{ 'contact.send' | translate }}
          </button>

          <p class="text-muted small mt-3 mb-0">
            {{ 'contact.note' | translate }}
          </p>
        </form>
      </div>

      <div class="col-12 col-lg-6">
        <div class="card">
          <div class="card-body">
            <h2 class="h5">{{ 'contact.links' | translate }}</h2>
            <ul class="mb-0">
              <li><a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a></li>
              <li><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
  `,
})
export class ContactComponent {
    form = this.fb.nonNullable.group({
        name: [''],
        email: ['', [Validators.required, Validators.email]],
        message: ['', [Validators.required, Validators.minLength(10)]],
    });

    // TODO: cambia esto por tu email real
    private readonly toEmail = 'your@email.com';

    constructor(private readonly fb: FormBuilder) {}

    openMail() {
        if (this.form.invalid) return;

        const { name, email, message } = this.form.getRawValue();
        const subject = encodeURIComponent(`[Portfolio] Message from ${name || 'visitor'}`);
        const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`);

        window.location.href = `mailto:${this.toEmail}?subject=${subject}&body=${body}`;
    }
}

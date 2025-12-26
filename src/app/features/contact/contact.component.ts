import { Component, inject, OnInit } from '@angular/core';
import {
    ReactiveFormsModule,
    Validators,
    FormBuilder,
    FormGroup,
    FormControl,
    AbstractControl,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { map, shareReplay } from 'rxjs/operators';

import { ContentService } from '../../core/content/content.service';
import { Profile } from '../../core/content/models';

export interface ContactFormGroup {
    name: FormControl<string>;
    email: FormControl<string>;
    message: FormControl<string>;
}

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, TranslateModule, AsyncPipe],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
    private fb = inject(FormBuilder);
    private translate = inject(TranslateService);
    private content = inject(ContentService);

    profile$ = this.content.getProfile().pipe(shareReplay(1));

    toEmail$ = this.profile$.pipe(
        map((p: Profile) => p.email ?? 'davidgimenez97dev@gmail.com')
    );

    copied = false;

    formGroup!: FormGroup<ContactFormGroup>;

    maxLengthNameField = 80;
    minLengthMessageField = 10;
    maxLengthMessageField = 2000;

    ngOnInit() {
        this.formGroup = this.fb.nonNullable.group<ContactFormGroup>({
            name: this.fb.nonNullable.control('', [
                Validators.required,
                Validators.maxLength(this.maxLengthNameField),
            ]),
            email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
            message: this.fb.nonNullable.control('', [
                Validators.required,
                Validators.minLength(this.minLengthMessageField),
                Validators.maxLength(this.maxLengthMessageField),
            ]),
        });
    }

    showErrors(ctrl: AbstractControl) {
        return ctrl.invalid && (ctrl.touched || ctrl.dirty);
    }

    isInvalid(ctrl: AbstractControl) {
        return this.showErrors(ctrl);
    }

    async copyEmail(email: string) {
        try {
            await navigator.clipboard.writeText(email);
            this.copied = true;
            window.setTimeout(() => (this.copied = false), 1200);
        } catch {
            // Best-effort fallback
            window.location.href = `mailto:${email}`;
        }
    }

    openMailQuick(toEmail: string) {
        const subject = this.translate.instant('contact.subject', { name: '—' });
        const body = this.translate.instant('contact.mail.quickBody');
        this.navigateToMailto(toEmail, subject, body);
    }

    openMail(toEmail: string) {
        if (this.formGroup.invalid) {
            this.formGroup.markAllAsTouched();
            return;
        }

        const raw = this.formGroup.getRawValue();

        const name = raw.name.trim();
        const email = raw.email.trim();
        const message = raw.message.trim();

        const subject = this.translate.instant('contact.subject', { name });

        const body = this.translate.instant('contact.mail.formBody', {
            name,
            email,
            message,
        });

        this.navigateToMailto(toEmail, subject, body);
    }

    private navigateToMailto(toEmail: string, subject: string, body: string) {
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        window.location.href = `mailto:${toEmail}?subject=${encodedSubject}&body=${encodedBody}`;
    }
}

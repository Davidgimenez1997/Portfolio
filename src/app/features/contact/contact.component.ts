import {Component, inject, OnInit} from '@angular/core';
import {
    ReactiveFormsModule,
    Validators,
    FormBuilder,
    FormGroup,
    FormControl,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

export interface ContactFormGroup {
    name: FormControl<string>;
    email: FormControl<string>;
    message: FormControl<string>;
}

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, TranslateModule],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {

    private formBuilder: FormBuilder = inject(FormBuilder);

    private readonly toEmail = 'davidgimenez97dev@gmail.com';

    formGroup!: FormGroup<ContactFormGroup>;

    maxLengthNameField = 80;

    minLengthMessageField = 10;
    maxLengthMessageField = 2000;

    ngOnInit() {
        this.formGroup = this.formBuilder.nonNullable.group<ContactFormGroup>({
            name: this.formBuilder.nonNullable.control('',
                [Validators.required, Validators.maxLength(this.maxLengthNameField)]),
            email: this.formBuilder.nonNullable.control('',
                [Validators.required, Validators.email]),
            message: this.formBuilder.nonNullable.control('',
                [Validators.required, Validators.minLength(this.minLengthMessageField),
                    Validators.maxLength(this.maxLengthMessageField)]),
        });
    }

    openMail() {
        if (this.formGroup.invalid) {
            this.formGroup.markAllAsTouched();
            return;
        }

        const raw = this.formGroup.getRawValue();

        const name = raw.name.trim();
        const email = raw.email.trim();
        const message = raw.message.trim();

        const subject = encodeURIComponent(`[Portfolio] Message from ${name}`);
        const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`);

        window.location.href = `mailto:${this.toEmail}?subject=${subject}&body=${body}`;
    }
}

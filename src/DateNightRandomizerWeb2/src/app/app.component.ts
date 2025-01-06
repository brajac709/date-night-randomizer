import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, Injector } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {

  private _injector = inject(Injector)
  private _http = inject(HttpClient);

  title = 'date-night-randomizer2';
  data = toSignal(this._http.get<{message: string}>("/api/hello"), {
    injector: this._injector,
    initialValue: {message: "none"}
  });
}

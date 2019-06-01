import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReply } from 'app/shared/model/reply.model';

@Component({
  selector: 'jhi-reply-detail',
  templateUrl: './reply-detail.component.html'
})
export class ReplyDetailComponent implements OnInit {
  reply: IReply;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ reply }) => {
      this.reply = reply;
    });
  }

  previousState() {
    window.history.back();
  }
}

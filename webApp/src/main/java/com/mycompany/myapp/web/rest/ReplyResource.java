package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Reply;
import com.mycompany.myapp.service.ReplyService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Reply}.
 */
@RestController
@RequestMapping("/api")
public class ReplyResource {

    private final Logger log = LoggerFactory.getLogger(ReplyResource.class);

    private static final String ENTITY_NAME = "reply";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReplyService replyService;

    public ReplyResource(ReplyService replyService) {
        this.replyService = replyService;
    }

    /**
     * {@code POST  /replies} : Create a new reply.
     *
     * @param reply the reply to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reply, or with status {@code 400 (Bad Request)} if the reply has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/replies")
    public ResponseEntity<Reply> createReply(@Valid @RequestBody Reply reply) throws URISyntaxException {
        log.debug("REST request to save Reply : {}", reply);
        if (reply.getId() != null) {
            throw new BadRequestAlertException("A new reply cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Reply result = replyService.save(reply);
        return ResponseEntity.created(new URI("/api/replies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /replies} : Updates an existing reply.
     *
     * @param reply the reply to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reply,
     * or with status {@code 400 (Bad Request)} if the reply is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reply couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/replies")
    public ResponseEntity<Reply> updateReply(@Valid @RequestBody Reply reply) throws URISyntaxException {
        log.debug("REST request to update Reply : {}", reply);
        if (reply.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Reply result = replyService.save(reply);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, reply.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /replies} : get all the replies.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of replies in body.
     */
    @GetMapping("/replies")
    public ResponseEntity<List<Reply>> getAllReplies(Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to get a page of Replies");
        Page<Reply> page = replyService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /replies/:id} : get the "id" reply.
     *
     * @param id the id of the reply to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reply, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/replies/{id}")
    public ResponseEntity<Reply> getReply(@PathVariable Long id) {
        log.debug("REST request to get Reply : {}", id);
        Optional<Reply> reply = replyService.findOne(id);
        return ResponseUtil.wrapOrNotFound(reply);
    }

    /**
     * {@code DELETE  /replies/:id} : delete the "id" reply.
     *
     * @param id the id of the reply to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/replies/{id}")
    public ResponseEntity<Void> deleteReply(@PathVariable Long id) {
        log.debug("REST request to delete Reply : {}", id);
        replyService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}

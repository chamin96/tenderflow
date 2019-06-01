package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Tender;
import com.mycompany.myapp.service.TenderService;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Tender}.
 */
@RestController
@RequestMapping("/api")
public class TenderResource {

    private final Logger log = LoggerFactory.getLogger(TenderResource.class);

    private static final String ENTITY_NAME = "tender";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TenderService tenderService;

    public TenderResource(TenderService tenderService) {
        this.tenderService = tenderService;
    }

    /**
     * {@code POST  /tenders} : Create a new tender.
     *
     * @param tender the tender to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tender, or with status {@code 400 (Bad Request)} if the tender has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tenders")
    public ResponseEntity<Tender> createTender(@Valid @RequestBody Tender tender) throws URISyntaxException {
        log.debug("REST request to save Tender : {}", tender);
        if (tender.getId() != null) {
            throw new BadRequestAlertException("A new tender cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Tender result = tenderService.save(tender);
        return ResponseEntity.created(new URI("/api/tenders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tenders} : Updates an existing tender.
     *
     * @param tender the tender to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tender,
     * or with status {@code 400 (Bad Request)} if the tender is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tender couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tenders")
    public ResponseEntity<Tender> updateTender(@Valid @RequestBody Tender tender) throws URISyntaxException {
        log.debug("REST request to update Tender : {}", tender);
        if (tender.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Tender result = tenderService.save(tender);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, tender.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /tenders} : get all the tenders.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tenders in body.
     */
    @GetMapping("/tenders")
    public ResponseEntity<List<Tender>> getAllTenders(Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to get a page of Tenders");
        Page<Tender> page = tenderService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /tenders/:id} : get the "id" tender.
     *
     * @param id the id of the tender to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tender, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tenders/{id}")
    public ResponseEntity<Tender> getTender(@PathVariable Long id) {
        log.debug("REST request to get Tender : {}", id);
        Optional<Tender> tender = tenderService.findOne(id);
        return ResponseUtil.wrapOrNotFound(tender);
    }

    /**
     * {@code DELETE  /tenders/:id} : delete the "id" tender.
     *
     * @param id the id of the tender to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tenders/{id}")
    public ResponseEntity<Void> deleteTender(@PathVariable Long id) {
        log.debug("REST request to delete Tender : {}", id);
        tenderService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}

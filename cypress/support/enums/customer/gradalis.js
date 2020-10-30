/*
*
*
*
*/

export { workflowChainEnum, worksheetEnum, sampleType }

const workflowChainEnum = Object.freeze({
    VIGIL_BATCH_PRODUCTION: 'Vigil Batch Production'
})

const worksheetEnum = Object.freeze({
    INITIATE_BPR_WORKFLOWS_1: '1. Initiate BPR Workflows',
    LAB_SETUP_2: '2. Lab Setup',
    SETTLE_PLATES_3: '3. Settle Plates',
    REAGENT_PREP_4: '4. Reagent Prep',
    CLEANROOM_OBSERVATIONS_5: '5. Cleanroom Observations',
    PREPARE_TISSUE_6: '6. Prepare Tissue',
    EVALUATE_TISSUE_7: '7. Evaluate Tissue',
    PROCESS_TISSUE_8: '8. Process Tissue',
    COUNT_CELLS_9: '9. Count Cells',
    PRE_TRANSFECTION_SAMPLE_COLLECTION_10: '10. Pre-Transfection Sample Collection',
    PRE_TRANSFECTION_SAMPLE_STORAGE_11: '11. Pre-Transfection Sample Storage',
    TRANSFECTION_12: '12. Transfection',
    END_OF_DAY_1_13: '13. End of Day 1',
    START_OF_DAY_2_14: '14. Start of Day 2',
    MYCOPLASMA_ALIQUOTS_15: '15. Mycoplasma Aliquots',
    MYCOPLASMA_RETAINS_AND_CELL_COUNT_16: '16. Mycoplasma Retains & Cell Count',
    IRRADIATION_17: '17. Irradiation',
    PREPARE_FILLING_STATION_18: '18. Prepare Filling Station',
    POST_IR_CELL_COUNT_19: '19. Post-IR Cell Count',
    POST_IR_PRODUCTION_ALIQUOTS_20: '20. Post-IR Production Aliquots',
    POST_IR_PRODUCTION_STORAGE_21: '21. Post-IR Production Storage',
    PREPARE_VIGIL_VIALS_22: '22. Prepare Vigil Vials',
    FILL_VIGIL_VIALS_23: '23. Fill Vigil Vials',
    STORE_VIGIL_VIALS_24: '24. Store Vigil Vials',
    LABEL_VIGIL_VIALS_25: '25. Label Vigil Vials',
    END_OF_DAY_2_26: '26. End of Day 2',
    EXPORT_BPR_27: '27. Export BPR'
})

const sampleType = Object.freeze({
    VIGIL_LOT: 'Vigil Lot'
})
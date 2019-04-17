class processStructure {

    constructor(structureName, stages, sankey,available,onlineForms) {
        this.structureName = structureName;
        this.stages = stages;
        this.sankey = sankey;
        this.available = available;
        this.onlineForms = onlineForms;
    }

    getInitialStageByRoleID(roleID, dereg) {
        let initialStages = this.stages.filter((stage)=>stage.stagesToWaitFor.length === 0);
        while(initialStages.length !== 0)
        {
            let firstStage = initialStages.shift();
            if(firstStage.kind === 'ByRole' && roleID.id.toString() === firstStage.roleID.toString())
            {
                return firstStage.stageNum;
            }
            if(firstStage.kind === 'ByDereg' && dereg === firstStage.dereg)
            {
                return firstStage.stageNum;
            }
            initialStages = initialStages.concat(firstStage.nextStages);
        }
        return -1;
    }

    checkNotDupStagesInStructure()
    {
        for(let i=0;i<this.stages.length;i++)
        {
            for(let j=0;j<this.stages.length;j++)
            {
                if(i !== j)
                {
                    if(this.stages[i].stageNum === this.stages[j].stageNum)
                    {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    /*checkInitialsExistInProcessStages()
    {
        for(let i=0;i<this.initials.length;i++)
        {
            let found = false;
            for(let j=0;j<this.stages.length;j++)
            {
                if(this.initials[i] === this.stages[j].stageNum)
                {
                    found = true;
                }
            }
            if(!found)
            {
                return false;
            }
        }
        return true;
    };*/

    checkPrevNextSymmetric()
    {
        for(let i=0;i<this.stages.length;i++)
        {
            for(let j=0;j<this.stages[i].stagesToWaitFor.length;j++)
            {
                for(let k=0;k<this.stages.length;k++)
                {
                    if(this.stages[k].stageNum === this.stages[i].stagesToWaitFor[j])
                    {
                        if(!this.stages[k].nextStages.includes(this.stages[i].stageNum))
                        {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    };

    checkNextPrevSymmetric()
    {
        for(let i=0;i<this.stages.length;i++)
        {
            for(let j=0;j<this.stages[i].nextStages.length;j++)
            {
                for(let k=0;k<this.stages.length;k++)
                {
                    if(this.stages[k].stageNum === this.stages[i].nextStages[j])
                    {
                        if(!this.stages[k].stagesToWaitFor.includes(this.stages[i].stageNum))
                        {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    };

    getFormsOfStage() {
        return this.stages.reduce((acc, stage) => {
            acc[stage.roleID] = stage.onlineForms;
            return acc;
        }, {})
    }
}

module.exports = processStructure;
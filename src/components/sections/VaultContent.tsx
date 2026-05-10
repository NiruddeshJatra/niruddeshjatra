import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isVaultUnlocked } from "@/lib/vault";

const VaultContent = () => {
  const navigate = useNavigate();
  const [unlocked] = useState(() => isVaultUnlocked());

  useEffect(() => {
    if (!unlocked) {
      navigate("/vault");
    }
  }, [navigate, unlocked]);

  if (!unlocked) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 font-mono text-[15px] leading-[1.7] text-foreground/85">
      <div className="mb-8">
        <h1 className="text-xl tracking-[0.15em] uppercase mb-1">the vault</h1>
        <p className="text-xs text-foreground/45">
          everything the public site doesn't say. nj · ongoing.
        </p>
      </div>

      <div className="pl-2 mb-6">
        <p>
          <span className="text-phosphor">&gt; </span>if you're reading this,
          you know the password. so you know me.
        </p>
        <p>
          <span className="text-phosphor">&gt; </span>or you knew me well enough
          that i told you the password.
        </p>
        <p>
          <span className="text-phosphor">&gt; </span>either way: this is the
          version of the site that doesn't exist
        </p>
        <p>
          <span className="text-phosphor">&gt; </span>for anyone else.
        </p>
      </div>

      <div className="pl-2 mb-6">
        <p>
          <span className="text-phosphor">&gt; </span>the public site is honest,
          but selective. it tells the truth
        </p>
        <p>
          <span className="text-phosphor">&gt; </span>only as far as i'm willing
          to tell it to strangers, family,
        </p>
        <p>
          <span className="text-phosphor">&gt; </span>students, neighbors. the
          careful kind of honest.
        </p>
      </div>

      <div className="pl-2 mb-10">
        <p>
          <span className="text-phosphor">&gt; </span>this page is the other
          kind. less careful. less filtered.
        </p>
        <p>
          <span className="text-phosphor">&gt; </span>written for people who
          already know enough that knowing more
        </p>
        <p>
          <span className="text-phosphor">&gt; </span>won't surprise them.
        </p>
      </div>

      <div className="mb-8">
        <p className="text-phosphor-dim mb-3">// who you might be</p>
        <div className="pl-2 space-y-4">
          <p>
            if you're my partner, you know almost all of this. some you don't.
          </p>
          <p>
            if you're family — close family — you know the parts about each
            other. you might not know the parts about me alone.
          </p>
          <p>
            if you're a friend i trusted enough to share the password with,
            welcome. some of this is new. ask me anything when you next see me.
          </p>
          <p>
            if you found the password some other way — i'm impressed and
            slightly worried. read carefully. don't share what you read.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-phosphor-dim mb-3">
          // the dropout — what actually happened
        </p>
        <div className="pl-2">
          <p>
            in 2018 i was at chittagong university of engineering and technology, 
            studying computer science. one of the most respected engineering universities 
            in bangladesh. i was excited to learn something new and challenging. i lasted one year.
          </p>
          <br />
          <p>
            the problem wasn't the subject — i loved the subject, still do. the 
            problem was the gap between what learning is supposed to be and what 
            school treats it as. teachers teaching for the syllabus, not for the 
            discipline. exams that rewarded structured answers over actual 
            understanding. classmates studying for grades that would convert into 
            job offers. the whole machinery aimed at producing employable people 
            rather than people who could think.
          </p>
          <br />
          <p>
            i couldn't sit in it. so i stopped going.
          </p>
          <br />
          <p>
            in bangladesh, dropping out of a top engineering school is not 
            an interesting personal choice — it's a public failure that affects 
            your family's social standing, every relative's opinion of your parents' judgment, people unnecessarily worrying about your future.
          </p>
          <br />
          <p>
            most people still don't know. they think i 
            graduated. my parents and i have an unspoken agreement to keep it 
            that way. it's why the public site doesn't say it directly. it's why 
            education.txt on the public site reads "a degree i never cherished" 
            rather than "i quit." i'm not lying — anyone who knows me can read 
            between the lines — but i'm not announcing it either.
          </p>
          <br />
          <p>
            if you're reading this and you're one of those who doesn't know: 
            now you do. i'm not sorry i did it. i'm sorry it has to be a secret. 
            those are different things.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-phosphor-dim mb-3">// the family</p>
        <div className="pl-2">
          <p>
            i've been the financial spine of my family since i was in college. 
            that's not a complaint — i'd do it again — but it's a fact, and it 
            explains a lot of the choices that look strange from outside.
          </p>
          <br />
          <p>
            why i still tutor instead of taking a job that pays more and gives 
            me more time to make games or build a startup: tuition income is 
            immediate, predictable, and i control the schedule.
          </p>
          <br />
          <p>
            why i didn't push back harder on the company i didn't want to work for in 2025-2026: 
            same answer. quitting that job was already a financial risk. the 
            margin for principled refusal was small.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-phosphor-dim mb-3">// order and truth</p>
        <div className="pl-2">
          <p>
            i've been reading harari's nexus this year, slowly, between tuitions. 
            the framework that's stuck with me is this: societies hold together 
            on a balance between truth and order. all-truth, no-order is the 
            enlightenment fantasy that ends in revolution. all-order, no-truth 
            is what dictatorships and orthodoxies do. real societies have to 
            balance.
          </p>
          <br />
          <p>
            i think individuals work the same way. i could publish every truth 
            about my life on the public site. it would feel honest. it would 
            also rip up agreements that took years to negotiate.
          </p>
          <br />
          <p>
            so i'm calibrating. the public site is honest, but it doesn't tell 
            everything. the parts it doesn't tell aren't lies — they're 
            omissions. the page about education says "a degree i never cherished," 
            not "i dropped out." both are true. one disrupts less.
          </p>
          <br />
          <p>
            i don't know if i'll always make this calibration the same way. some 
            of it might shift when i have financial independence enough that disruption 
            doesn't have downstream costs i can't afford. for now, this is where 
            i've drawn the line. this vault is the pressure valve.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-phosphor-dim mb-3">// what i actually want next</p>
        <div className="pl-2">
          <p>
            kanchenjunga. not as a vacation — as a real climb. i've been hiking 
            bandarban since 2018, doing the kind of trips that go life-threatening 
            occasionally. the next step is technical mountaineering with 
            altitude. kanchenjunga base camp first, then maybe the summit if i'm capable of it. this is a five-to-ten-year project, 
            not a next-year one. i don't talk about it because saying it out 
            loud locks it in, and locking in long timelines while i still don't 
            have financial stability feels like inviting failure.
          </p>
          <br />
          <p>
            the second startup attempt. not bhara — bhara is dead, the partner 
            left, the moment passed. but something else, in a few years, when 
            i can fund six months of runway from savings and don't need anyone 
            else's money or time. probably something at the intersection of 
            education and the things i'm actually good at — explaining concepts, 
            making interfaces that respect the user. i don't know what shape it 
            will take. i'll know when i see it.
          </p>
          <br />
          <p>
            a 100k completion this year. a sub-10-hour 100k is the long term goal. 
            these are athletic targets but they sit in the same 
            list because i don't separate the projects.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-phosphor-dim mb-3">// what i'm not saying yet</p>
        <div className="pl-2">
          <p>
            things that might end up here over time:
          </p>
          <br />
          <p>
            the version of the family story that 
            includes resentments alongside gratitude. specific things about 
            the year between dropping out and starting cs again — the depressive 
            months, the time i lost, the books i remember reading and the ones 
            i pretended to. specific health things if they become relevant.
          </p>
          <br />
          <p>
            none of this is missing because i'm hiding it. it's missing because 
            i haven't figured out how to write it yet. add nothing here that 
            doesn't already feel true. delete nothing. let the document evolve.
          </p>
        </div>
      </div>

      <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
        — nj · vault · ongoing
      </div>
    </div>
  );
};

export default VaultContent;
